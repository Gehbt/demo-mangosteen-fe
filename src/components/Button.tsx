import s from "./Button.module.scss";
// interface ButtonProps {
//   onClick?: (e: MouseEvent | TouchEvent) => void;
//   class: string | string[];
// }
export const Button = defineComponent({
  // inheritAttrs: false,
  props: {
    onClick: {
      type: Function as PropType<JSX.IntrinsicElements["button"]["onClick"]>,
    },
    // any<JSX.IntrinsicElements["button"]["onClick"]>(),
    class: [String, Array] as PropType<string | string[]>,
    // any<string | string[]>(),
    level: {
      type: String as PropType<"primary" | "default" | "danger">,
      default: "default",
    },
    // string<"primary" | "default" | "danger">().def("default"),
    clan: {
      type: String as PropType<"button" | "submit" | "reset">,
      default: "button",
    },
    // string<"button" | "submit" | "reset">().def("button"),
    disableByCtx: {
      type: Boolean,
      default: false,
    },
    // bool().def(false),
    selfDisciplineMode: {
      type: Boolean,
      default: false,
    },
    // bool().def(false),
  },
  name: "Button",
  setup(props, context) {
    // 点击控制关闭
    const self_disable = ref(false);
    const wrapper_onclick = (e: MouseEvent) => {
      props.onClick?.(e);
      self_disable.value = true;
      window.setTimeout(() => {
        self_disable.value = false;
      }, 1000);
    };
    const _disable = computed(() => {
      if (props.disableByCtx) {
        return true;
      } else {
        // 仅当开启自肃mode时 关闭控制
        if (props.selfDisciplineMode && self_disable.value) {
          return true;
        } else {
          return self_disable.value;
        }
      }
    });
    return () => (
      <button
        class={[
          s.btn,
          props.class,
          s[props.level],
          _disable.value ? s.toggled : "",
        ]}
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
    },
    // string().def(svgs.round_add),
    onClick: Function as PropType<(e: MouseEvent | TouchEvent) => void>,
    // func<(e: MouseEvent | TouchEvent) => void>(),
  },
  setup(props) {
    return () => (
      <button class={s.fbtn} onClick={props.onClick}>
        <svg-icon class={s.icon} name={props.iconName}></svg-icon>
      </button>
    );
  },
});
