import { defineComponent } from "vue";
import s from "./Navbar.module.scss";

export const Navbar = defineComponent({
  name: "Navbar",
  emits: ["toggleOverlay"],
  setup(props, context) {
    const { slots } = context;
    return () => (
      <div class={s.navbar}>
        <span
          class={s.icon_wrapper}
          onClick={() => context.emit("toggleOverlay")}
        >
          {slots.icon?.(s.icon)}
        </span>
        <span class={s.title_wrapper}>{slots.title?.()}</span>
      </div>
    );
  },
});
