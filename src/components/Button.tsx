import { defineComponent } from "vue";
import s from "./Button.module.scss";
// interface ButtonProps {
//   onClick?: (e: MouseEvent | TouchEvent) => void;
//   class: string | string[];
// }
export const Button = defineComponent({
  // inheritAttrs: false,
  props: {
    onClick: func<(e: MouseEvent | TouchEvent) => void>(),
    class: any<string | string[]>(),
    level: string<"primary" | "default" | "danger">().def("default"),
    clan: string<"button" | "submit" | "reset">().def("button"),
    disableByCtx: bool().def(false),
    selfDisciplineMode: bool().def(false),
  },
  name: "Button",
  setup(props, context) {
    // 点击控制关闭
    const self_disable = ref(false);
    const wrapper_onclick = (e: MouseEvent | TouchEvent) => {
      props.onClick?.(e);
      self_disable.value = true;
      setTimeout(() => {
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
        class={[s.btn, props.class, s[props.level], _disable.value ? s.toggled : '']}
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
    iconName: string().def(svgs.round_add),
    onClick: func<(e: MouseEvent | TouchEvent) => void>(),
    // {
    //   type: Function as PropType<(e: MouseEvent | TouchEvent) => void>,
    //   required: false,
    // },
  },
  setup(props) {
    return () => (
      <button class={s.fbtn} onClick={props.onClick}>
        <svg-icon class={s.icon} name={props.iconName}></svg-icon>
      </button>
    );
  },
});
