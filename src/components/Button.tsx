import { PropType, defineComponent } from "vue";
import s from "./Button.module.scss";
import SvgIcon from "./SvgIcon";
import svg from "@svg_map";
// interface ButtonProps {
//   onClick?: (e: MouseEvent | TouchEvent) => void;
//   class: string | string[];
// }
export const Button = defineComponent({
  // inheritAttrs: false,
  props: {
    onClick: {
      type: Function as PropType<(e: MouseEvent | TouchEvent) => void>,
    },
    class: {
      type: String as PropType<string | string[]>,
    },
    level: {
      type: String as PropType<"primary" | "default" | "danger">,
      default: "default",
    },
  },
  name: "Button",
  setup(props, context) {
    return () => (
      <button
        class={[s.btn, props.class, s[props.level]]}
        onClick={props.onClick}
      >
        {context.slots.default?.()}
      </button>
    );
  },
});
export const Floatbutton = defineComponent({
  name: "Floatbutton",
  props: {
    iconName: {
      type: String,
      default: svg.round_add,
      required: false,
    },
  },
  setup(props) {
    return () => (
      <div class={s.fbtn}>
        <SvgIcon class={s.icon} name={props.iconName}></SvgIcon>
      </div>
    );
  },
});
