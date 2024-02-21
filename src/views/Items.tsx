import s from "./Items.module.scss";
import { RouterView } from "vue-router";

export const Items = defineComponent({
  name: "Items",
  setup(props, context) {
    return () => (
      <div class={s.items}>
        <RouterView></RouterView>
      </div>
    );
  },
});
export default Items;
