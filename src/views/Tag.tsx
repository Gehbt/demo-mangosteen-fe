import s from "./Tag.module.scss";
import { RouterView } from "vue-router";
export const Tag = defineComponent({
  name: "Tag",
  setup(props, context) {
    return () => (
      <div>
        <RouterView />
      </div>
    );
  },
});
export default Tag;
