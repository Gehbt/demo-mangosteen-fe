import { PropType, defineComponent } from "vue";
import s from "./Button.module.scss";
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
    clan: {
      type: String as PropType<"button" | "submit" | "reset">,
      default: "button",
    },
    disableByCtx: {
      type: Boolean as PropType<boolean>,
    },
  },
  name: "Button",
  setup(props, context) {
    return () => (
      <button
        class={[s.btn, props.class, s[props.level]]}
        disabled={props.disableByCtx}
        onClick={props.onClick}
        type={props.clan}
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
      default: svgs.round_add,
      required: false,
    },
    onClick: {
      type: Function as PropType<(e: MouseEvent | TouchEvent) => void>,
      required: false,
    },
  },
  setup(props) {
    return () => (
      <button class={s.fbtn} onClick={props.onClick}>
        <svg-icon class={s.icon} name={props.iconName}></svg-icon>
      </button>
    );
  },
});
