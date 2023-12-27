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
      required: true,
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
      default: false,
    },
    selfDisciplineMode: {
      type: Boolean as PropType<boolean>,
      default: false,
      required: false,
    },
  },
  name: "Button",
  setup(props, context) {
    const self_disable = ref(false);
    const wrapper_onclick = (e: MouseEvent | TouchEvent) => {
      props.onClick?.(e);
      self_disable.value = true;
      setTimeout(() => {
        self_disable.value = false;
      }, 1000);
    };
    const _disable = computed(() => {
      if (!props.selfDisciplineMode) {
        return props.disableByCtx;
      } else {
        // settinged selfDisciplineMode
        if (self_disable.value && !props.disableByCtx) {
          return true;
        } else {
          return props.disableByCtx;
        }
      }
    });
    return () => (
      <button
        class={[s.btn, props.class, s[props.level]]}
        disabled={_disable.value}
        onClick={wrapper_onclick}
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
