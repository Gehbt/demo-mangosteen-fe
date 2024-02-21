import { Transition } from "vue";
import { RouterView } from "vue-router";
import s from "./Welcome.module.scss";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { Direction, useSwiper } from "@/composables/swiper";
import { throttle } from "lodash-es";
import { W1, W2, W3, W4, WEndFooter, WFooter } from "@/components/welcome";
import { Swipe, SwipeItem } from "vant";
export const Welcome = defineComponent({
  name: "Welcome",
  setup() {
    const route = useRoute();
    const router = useRouter();
    onBeforeMount(() => {
      if (localStorage.getItem("skipWelcome") === "yes") {
        router.replace("/start");
      }
    });
    const main = ref<HTMLDivElement>();

    const { isSwiping, direction } = useSwiper(main, {
      beforeStart: (e) => e.preventDefault(),
    });
    // 还可以使用 对象(对象替代switch同样的思路)
    // ?TODO: 使用router.go(1 | -1)(缓存)
    const toNextPage = throttle(
      (dire_effect: number) => {
        const index = parseInt(
          route.path.match(/\/welcome\/(\d+)/)?.[1] ?? "0"
        );
        if (index === 4) {
          router.push("/start");
        } else {
          router.push(`/welcome/${index + dire_effect}`);
        }
      },
      500,
      { trailing: false }
    );
    watchEffect(() => {
      if (isSwiping.value) {
        if (direction.value === Direction.l) {
          toNextPage(1);
        } else if (direction.value === Direction.r) {
          router.back();
          route.meta.seq = false;
        }
      }
    });

    return () => (
      <div class={s.wrapper}>
        <header>
          <svg-icon name={svgs.blueberry2} class={s.main_svg_container} />
          <h2>蓝莓记账</h2>
        </header>
        <main ref={main} class={s.main}>
          <RouterView name="main">
            {({
              Component: P,
              route: R,
            }: {
              Component: VNode;
              route: RouteLocationNormalizedLoaded;
            }) => {
              const motion = {
                from: s.slide_fade_enter_from,
                to: s.slide_fade_leave_to,
              };
              if (!R.meta.seq) {
                motion.from = s.slide_fade_enter_from_rev;
                motion.to = s.slide_fade_leave_to_rev;
              }
              return (
                <Transition
                  enterFromClass={motion.from}
                  leaveToClass={motion.to}
                  enterActiveClass={s.slide_fade_enter_active}
                  leaveActiveClass={s.slide_fade_leave_active}
                >
                  {P}
                </Transition>
              );
            }}
          </RouterView>
        </main>
        <footer>
          <RouterView name="footer" />
        </footer>
      </div>
    );
  },
});
//// 使用css`scroll-snap` 实现无缝切换的的版本
// 使用 vant 实现无缝切换的的版本
export const Welcome2 = defineComponent({
  name: "Welcome2",
  setup(props, context) {
    const W1F = WFooter(1);
    const W2F = WFooter(2);
    const W3F = WFooter(3);
    return () => (
      <div class={s.wrapper2}>
        <header>
          <svg-icon name={svgs.blueberry2} class={s.main_svg_container} />
          <h2>蓝莓记账</h2>
        </header>
        <main class={s.main}>
          <Swipe class={s.swiper}>
            <SwipeItem class={s.swiper_item}>
              <W1 />
            </SwipeItem>
            <SwipeItem class={s.swiper_item}>
              <W2 />
            </SwipeItem>
            <SwipeItem class={s.swiper_item}>
              <W3 />
            </SwipeItem>
            <SwipeItem class={s.swiper_item}>
              <W4 />
            </SwipeItem>
          </Swipe>
        </main>
        <footer>
          {/* <W1F />
          <W2F />
          <W3F /> */}
          <WEndFooter />
        </footer>
      </div>
    );
  },
});
export default Welcome;
