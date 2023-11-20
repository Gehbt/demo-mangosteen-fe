import { PropType, defineComponent } from "vue";
import type { ItemsName } from "@/components/ItemsList";
import s from "./Tabs.module.scss";
export const Tabs = defineComponent({
  name: "Tabs",
  props: {
    selected: {
      type: String as PropType<ItemsName>,
      default: "支出",
      required: true,
    },
    // onUpdateSelected: {
    //   type: Function,
    // },
  },
  // emits: ["updateSelected"],
  setup(props, context) {
    return () => {
      if (!context.slots.default?.()) {
        return () => null;
      }
      const tabs = context.slots.default();
      // arr.forEach((item) => {
      //   if (item.type !== Tab) {
      //     throw new Error("<Tabs> only accepts Tab as children");
      //   }
      // });

      return (
        <div class={s.tabs}>
          <ol class={s.tabs_nav}>
            {tabs.map((item) => (
              <li
                class={item.props?.name === props.selected ? s.selected : ""}
                onClick={() =>
                  context.emit("update:selected", item.props?.name)
                }
              >
                {item.props?.name}
              </li>
            ))}
          </ol>
          <div>
            {tabs.filter((item) => item.props?.name === props.selected)}
          </div>
        </div>
      );
    };
  },
});
export const Tab = defineComponent({
  name: "Tab",
  props: {
    name: {
      type: String as PropType<ItemsName>,
    },
  },
  setup(props, context) {
    return () => <div>{context.slots.default?.()}</div>;
  },
});
