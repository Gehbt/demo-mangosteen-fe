import { defineComponent } from "vue";
import s from "./Navbar.module.scss";
interface NavbarProps {
  onClick?: (e: MouseEvent | TouchEvent) => void;
}
export const Navbar = defineComponent<NavbarProps>({
  name: "Navbar",
  setup(props, context) {
    const { slots } = context;
    return () => (
      <div class={s.navbar}>
        <span class={s.icon_wrapper}>{slots.icon?.(s.icon)}</span>
        <span class={s.title_wrapper}>{slots.title?.()}</span>
      </div>
    );
  },
});
