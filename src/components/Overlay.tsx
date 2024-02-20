import s from "./Overlay.module.scss";
import { RouterLink } from "vue-router/auto";
import { httpClient } from "@/shared";
import { showConfirmDialog } from "vant";
import { fetchMe } from "@/composables";

export const Overlay = defineComponent({
  name: "Overlay",
  props: {
    status: bool(),
    parentPath: string().isRequired,
  },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    // *使用 SessionStorage 是方便开发实际上应该使用 LocalStorage
    const jwt = useLocalStorage<string | null>("jwt", null);
    const me = useSessionStorage<UserType | null>("me", null, {
      mergeDefaults: true,
      serializer: {
        read(raw) {
          return superjson.parse(raw);
        },
        write(value) {
          return superjson.stringify(value);
        },
      },
    });
    onMounted(async () => {
      console.log("overlay onMounted :>> ");
      if (!me.value) {
        console.log("do fetchMe :>> ");
        try {
          me.value = await fetchMe();
          if (!me.value) {
            throw new Error("no login");
          }
          console.log("me :>> ", me.value);
        } catch (e) {
          console.log("fetchMe err :>> ", e);
          console.log("route.fullPath :>> ", route.fullPath);
          // router.push(`/sign_in?return_to=${route.fullPath}`);
        }
      }
    });
    const handleLogout = async () => {
      try {
        await httpClient.head<JWTResponseType>("/logout").then((response) => {
          // 接收过期的token
          console.log("new :>> jwt", response.data.jwt);
          jwt.value = response.data.jwt;
          router.push("/start");
        });
        // await refreshMe();
      } catch (e) {
        console.log("e :>> ", e);
      }
    };
    return () => (
      <div class={s.overlay}>
        <SignInCard v-if={!me.value} />
        <MeCard
          v-else
          meData={
            me.value /* jsx的 v-if 还没类型收窄能力 */ ??
            ({ name: "出错了" } as UserType)
          }
          onSignout={async () => {
            me.value = null;
            await handleLogout();
            router.push("/start");
          }}
        />
        <nav>
          <ul class={s.action_list}>
            <li>
              <RouterLink to="/statistics" class={s.action}>
                <svg-icon class={s.icon} name={svgs.charts3}></svg-icon>
                统计图表
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/notify" class={s.action}>
                <svg-icon class={s.icon} name={svgs.bell}></svg-icon>
                记账提醒
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/export" class={s.action}>
                <svg-icon class={s.icon} name={svgs.export}></svg-icon>
                导出数据
              </RouterLink>
            </li>
            <li
              class={s.last}
              v-if={!["/start", "/items"].includes(props.parentPath)}
            >
              <RouterLink to="/" class={s.action}>
                <svg-icon class={s.icon} name={svgs.back2}></svg-icon>
                返回首页
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    );
  },
});
export const MeCard = defineComponent({
  name: "MeCard",
  props: {
    meData: object<UserType>().isRequired,
  },
  emits: ["signout"],
  setup(props, context) {
    return () => (
      <section class={s.currentUser}>
        <h1>{props.meData.name}</h1>
        <p
          onClick={() => {
            showConfirmDialog({ message: "你确定要退出登录吗?" })
              .then(() => {
                context.emit("signout");
              })
              .catch(() => {});
          }}
        >
          点击这里注销
        </p>
      </section>
    );
  },
});
export const SignInCard = defineComponent({
  name: "SignInCard",
  setup(props, context) {
    console.log("SignInCard :>> ");
    const router = useRouter();
    const onClickSignIn = () => {
      // TODO: SignIn
      router.push("/sign_in?return_to=/start");
    };
    return () => (
      <section class={s.currentUser} onClick={onClickSignIn}>
        <h1>未登录用户</h1>
        <p>点击这里登录</p>
      </section>
    );
  },
});
export const OverlayMask = defineComponent({
  name: "OverlayMask",
  emits: ["blurOverlay"],
  render() {
    return (
      <div
        class={s.mask}
        onClick={() => {
          this.$emit("blurOverlay");
        }}
      ></div>
    );
  },
});

// export const OverlayIcon = defineComponent({
//   name: "OverlayIcon",
//   setup(props, context) {
//     const overlayVisibleRef = ref(false);
//     const toggleOverlay = () => {
//       overlayVisibleRef.value = true;
//     };
//     const blurOverlay = () => {
//       overlayVisibleRef.value = false;
//       console.log("blurOverlay :>> ", overlayVisibleRef.value);
//     };
//     return () => (
//       <>
//         <div onClick={toggleOverlay}>
//           <svg-icon name={svgs.menu} />
//         </div>
//         <div
//           style={{
//             visibility: overlayVisibleRef.value ? "visible" : "hidden",
//           }}
//         >
//           <Overlay parentPath="/start" />
//           <OverlayMask onBlurOverlay={blurOverlay} />
//         </div>
//       </>
//     );
//   },
// });
