import { Navbar } from "@/components/Navbar";
import s from "./MainLayout.module.scss";
export const MainLayout = defineComponent({
  name: "MainLayout",
  props: {
    title: { type: String, required: true },
    // string().isRequired,
    icon: { type: String, required: true },
    // string().isRequired,
    toggle: Function as PropType<() => void>,
    // func<() => void>(),
  },
  setup(props, context) {
    return () => (
      <div class={s.wrapper}>
        <Navbar onToggle={props.toggle} class={s.navbar}>
          {{
            title: () => props.title,
            icon: () => (
              <svg-icon
                name={props.icon}
                style={{
                  width: "30px",
                  height: "30px",
                  position: "relative",
                  top: "2px",
                }}
              ></svg-icon>
            ),
          }}
        </Navbar>
        {context.slots.default?.()}
      </div>
    );
  },
});
