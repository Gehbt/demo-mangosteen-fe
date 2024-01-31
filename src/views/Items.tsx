import { Transition, VNode, defineComponent } from "vue";
import s from "./Items.module.scss";
import { RouterView } from "vue-router/auto";

export const Items = defineComponent({
  name: "Items",
  setup(props, context) {
    return () => (
      <div class={s.items}>
        <RouterView>
          {/* {function ({ Component: P }: { Component: VNode }) {
            return (
              <Transition
                enterFromClass={s.row_in_enter_from}
                leaveToClass={s.row_in_leave_to}
                enterActiveClass={s.row_in_enter_active}
                leaveActiveClass={s.row_in_leave_active}
              >
                {P}
              </Transition>
            );
          }} */}
        </RouterView>
      </div>
    );
  },
});
