import { PropType, defineComponent, ref } from "vue";
import s from "./Charts.module.scss";
import { ItemsCreateName } from "../ItemsList";
export const Charts = defineComponent({
  name: "Charts",
  props: {
    startDate: {
      type: String as PropType<string>,
      required: true,
    },
    endDate: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props, context) {
    const category = ref<ItemsCreateName>("支出");
    return () => (
      <div class={s.wrapper}>
        <select value={category.value}>
          <option value="支出"></option>
          <option value="收入"></option>
        </select>
      </div>
    );
  },
});
