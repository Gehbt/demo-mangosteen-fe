import { defineComponent } from "vue";
import s from "./Tag.module.scss";
import { RouterView } from "vue-router/auto";
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
