import { PropType, defineComponent } from "vue";
import { Navbar } from "@/components/Navbar";
import SvgIcon from "@/components/SvgIcon";
import s from "./MainLayout.module.scss";
export const MainLayout = defineComponent({
  name: "MainLayout",
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    toggle: {
      type: Function as PropType<() => void>,
      required: false,
    },
  },
  setup(props, context) {
    return () => (
      <div class={s.wrapper}>
        <Navbar onToggle={props.toggle} class={s.navbar}>
          {{
            title: () => props.title,
            icon: () => (
              <SvgIcon
                name={props.icon}
                style={{
                  width: "30px",
                  height: "30px",
                  position: "relative",
                  top: "2px",
                }}
              ></SvgIcon>
            ),
          }}
        </Navbar>
        {context.slots.default?.()}
      </div>
    );
  },
});
