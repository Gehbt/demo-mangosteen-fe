import s from "./Center.module.scss";

export const Center = defineComponent({
  name: "Center",
  props: {
    direction: {
      type: String as PropType<"horizontal" | "vertical">,
      default: "horizontal",
    },
    // string<"horizontal" | "vertical">().def("horizontal"),
  },
  setup(props, context) {
    const direction =
      props.direction === "horizontal" ? s.horizontal : s.vertical;
    return () => (
      <div class={[s.center, direction]}>{context.slots.default?.()}</div>
    );
  },
});
