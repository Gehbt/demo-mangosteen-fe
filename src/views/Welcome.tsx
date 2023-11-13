import { Transition, VNode, defineComponent, ref, watchEffect } from "vue";
import { RouterView } from "vue-router/auto";
import s from "./Welcome.module.scss";
import { RouteLocationNormalizedLoaded } from "vue-router";
import svg from "@svg_map";
import SvgIcon from "@components/SvgIcon";
import { Direction, useSwiper } from "@/composables/swiper";
import { throttle } from "lodash";

export const Welcome = defineComponent({
  setup() {
    const main = ref<HTMLDivElement>();
    const route = useRoute();
    const router = useRouter();
    const { isSwiping, direction } = useSwiper(main, {
      beforeStart: (e) => e.preventDefault(),
    });
    // 还可以使用 对象(对象替代switch同样的思路)
    const replace = throttle(
      () => {
        const index = parseInt(
          route.path.match(/\/welcome\/(\d+)/)?.[1] ?? "0"
        );
        if (index <= 3 && index >= 1) {
          router.replace(`/welcome/${index + 1}`);
        } else if (index === 4) {
          router.replace("/start");
        } else {
          router.replace(`/welcome/${index + 1}`);
        }
      },
      500,
      { trailing: false }
    );
    watchEffect(() => {
      if (isSwiping.value && direction.value === Direction.l) {
        replace();
      }
    });
    return () => (
      <div class={s.wrapper}>
        <header>
          <SvgIcon name={svg.blueberry2} class={s.main_svg_container} />
          <h2>蓝莓记账</h2>
        </header>
        <main ref={main} class={s.main}>
          <RouterView name="main">
            {({
              Component: P,
              route: _R,
            }: {
              Component: VNode;
              route: RouteLocationNormalizedLoaded;
            }) => (
              <Transition
                enterFromClass={s.slide_fade_enter_from}
                enterActiveClass={s.slide_fade_enter_active}
                leaveToClass={s.slide_fade_leave_to}
                leaveActiveClass={s.slide_fade_leave_active}
              >
                {P}
              </Transition>
            )}
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
