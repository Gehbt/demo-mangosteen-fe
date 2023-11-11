import {
  Transition,
  VNode,
  VNodeRef,
  defineComponent,
  ref,
  watchEffect,
} from "vue";
import { RouterView } from "vue-router";
import s from "./Welcome.module.scss";
import { RouteLocationNormalizedLoaded } from "vue-router";
import svg from "@svg_map";
import SvgIcon from "@components/SvgIcon";
import { useSwiper } from "@/composables/swiper";

export const Welcome = defineComponent({
  setup() {
    const main: VNodeRef = ref<HTMLElement | null>(null);
    const { direction } = useSwiper(main);
    watchEffect(() => {
      if(direction.value){
        console.log("direction :>> ", direction.value);
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
              route: R,
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
