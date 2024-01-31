import { Transition, VNode, defineComponent, ref, watchEffect } from "vue";
import { RouterView } from "vue-router/auto";
import s from "./Welcome.module.scss";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { Direction, useSwiper } from "@/composables/swiper";
import { throttle } from "lodash-es";
import { W1, W2, W3, W4, WEndFooter, WFooter } from "@/components/welcome";
import { SwiperView } from "@/components/Swiper";
import { Swipe, SwipeItem } from "vant";
export const Welcome = defineComponent({
  name: "Welcome",
  setup() {
    const main = ref<HTMLDivElement>();
    const route = useRoute();
    const router = useRouter();
    const { isSwiping, direction } = useSwiper(main, {
      beforeStart: (e) => e.preventDefault(),
    });
    // 还可以使用 对象(对象替代switch同样的思路)
    const replace = throttle(
      (dire_effect: number) => {
        const index = parseInt(
          route.path.match(/\/welcome\/(\d+)/)?.[1] ?? "0"
        );
        // [1,2,3,4]
        // if (index <= 3 && index >= 2) {
        //   router.replace(`/welcome/${index + dire_effect}`);
        // } else
        if (index === 4) {
          router.replace("/start");
        } else {
          router.replace(`/welcome/${index + dire_effect}`);
        }
      },
      500,
      { trailing: false }
    );
    watchEffect(() => {
      if (isSwiping.value) {
        if (direction.value === Direction.l) {
          replace(1);
        } else if (direction.value === Direction.r) {
          replace(-1);
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
  // mounted() {
  // useSwiper(this.main)
  // },
});
// 使用css`scroll-snap` 实现无缝切换的的版本
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
