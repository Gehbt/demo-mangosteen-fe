import { PropType, defineComponent } from "vue";
import type { ItemsCreateName, ItemsListName } from "@/components/ItemsList";
import s from "./Tabs.module.scss";
export const Tabs = defineComponent({
  name: "Tabs",
  props: {
    classPrefix: {
      type: String,
      default: "",
    },
    selected: {
      type: String as PropType<ItemsCreateName | ItemsListName>,
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
      const inject_style = props.classPrefix;
      return (
        <div class={[s.tabs, inject_style + "_tabs"]}>
          <ol class={[s.tabs_nav, inject_style + "_tabs_nav"]}>
            {tabs.map((item) => (
              <li
                class={(item.props?.name === props.selected
                  ? [s.selected, inject_style + "_selected"]
                  : [""]
                ).concat(inject_style + "_tabs_nav_item")}
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
      type: String as PropType<ItemsCreateName | ItemsListName>,
    },
  },
  setup(props, context) {
    return () => <div>{context.slots.default?.()}</div>;
  },
});
