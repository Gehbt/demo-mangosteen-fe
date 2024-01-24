import { PropType, defineComponent } from "vue";
import { i18nT } from "@/shared/i18n-simple";
import s from "./Tabs.module.scss";
export const Tabs = defineComponent({
  name: "Tabs",
  props: {
    classPrefix: string().def(""),
    // {
    //   type: String,
    //   default: "",
    // },
    selected: string<TagKindType | DateScope>(),
    // {
    //   type: String as PropType<ItemsCreateName | ItemsListName>,
    //   default: "支出",
    //   required: true,
    // },
  },
  emits: ["update:selected"],
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
        <div class={s.wrapper}>
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
                  {/* as DateScope just for polyfill */}
                  {i18nT[item.props?.name as DateScope]}
                </li>
              ))}
            </ol>
            {tabs.map((item) => (
              <div v-show={item.props?.name === props.selected}>{item}</div>
            ))}
          </div>
        </div>
      );
    };
  },
});
export const Tab = defineComponent({
  name: "Tab",
  props: {
    name: string<TagKindType | DateScope>(),
    // {
    //   type: String as PropType<ItemsCreateName | ItemsListName>,
    // },
  },
  setup(props, context) {
    return () => <div>{context.slots.default?.()}</div>;
  },
});
