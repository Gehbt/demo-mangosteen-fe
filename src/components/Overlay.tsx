import { defineComponent, ref } from "vue";
import s from "./Overlay.module.scss";
import { RouterLink } from "vue-router/auto";
export const Overlay = defineComponent({
  name: "Overlay",
  props: {
    status: {
      type: Boolean,
      required: false,
    },
  },
  setup(props, context) {
    const router = useRouter();
    const onClickSignIn = () => {
      // TODO: SignIn
      router.replace("/sign_in");
    };
    return () => (
      <div class={s.overlay}>
        <section class={s.currentUser} onClick={onClickSignIn}>
          <h1>未登录用户</h1>
          <p>点击这里登录</p>
        </section>
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
          </ul>
        </nav>
      </div>
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

export const OverlayIcon = defineComponent({
  name: "OverlayIcon",
  setup(props, context) {
    const overlayVisibleRef = ref(false);
    const toggleOverlay = () => {
      overlayVisibleRef.value = true;
    };
    const blurOverlay = () => {
      overlayVisibleRef.value = false;
      console.log("blurOverlay :>> ", overlayVisibleRef.value);
    };
    return () => (
      <>
        <div onClick={toggleOverlay}>
          <svg-icon name={svgs.menu} />
        </div>
        <div
          style={{
            visibility: overlayVisibleRef.value ? "visible" : "hidden",
          }}
        >
          <Overlay />
          <OverlayMask onBlurOverlay={blurOverlay} />
        </div>
      </>
    );
  },
});
