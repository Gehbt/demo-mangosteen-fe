import { Transition, VNode, defineComponent } from "vue";
import { RouterView } from "vue-router";
import s from "./Welcome.module.scss";
import { RouteLocationNormalizedLoaded } from "vue-router";
import svg from "@svg_map"
import SvgIcon from "@components/SvgIcon";
export const Welcome = defineComponent({
  render() {
    return (
      <div class={s.wrapper}>
        <header>
          <SvgIcon name={svg.blueberry2} class={s.main_svg_container}/>
          <h2>蓝莓记账</h2>
        </header>
        <main class={s.main}>
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
});
