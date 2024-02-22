import { i18nT } from "@/shared/i18n-simple";
import s from "./Tabs.module.scss";
export const Tabs = defineComponent({
  name: "Tabs",
  props: {
    classPrefix: { type: String, default: "" },
    // string().def(""),
    selected: { type: String as PropType<TagKind | DateScope> },
    // string<TagKind | DateScope>() /* v-model:selected !== selected */,
    lessRender: { type: Boolean, default: false },
    // bool().def(false),
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
                  {/* as DateScope/TagKindType just for mapping */}
                  {i18nT[item.props?.name as DateScope | TagKind]}
                </li>
              ))}
            </ol>
            {props.lessRender
              ? tabs.map((item) => (
                  <div
                    v-if={item.props?.name === props.selected}
                    key={item.props?.name}
                  >
                    {item}
                  </div>
                ))
              : tabs.map((item) => (
                  <div
                    v-show={item.props?.name === props.selected}
                    key={item.props?.name}
                  >
                    {item}
                  </div>
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
    name: { type: String as PropType<TagKind | DateScope> },
    // string<TagKind | DateScope>(),
  },
  setup(props, context) {
    return () => <div>{context.slots.default?.()}</div>;
  },
});
