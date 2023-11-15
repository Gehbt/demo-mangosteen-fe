import { defineComponent } from "vue";
import s from "./Button.module.scss";
interface Props {
  onClick: (e: MouseEvent) => void;
  class: string;
}
export const Button = defineComponent<Props>({
  inheritAttrs: false,
  setup(props, context) {
    return () => (
      <button class={[s.btn, props.class]} onClick={props.onClick}>
        {context.slots.default?.()}
      </button>
    );
  },
});
