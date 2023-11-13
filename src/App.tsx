import { defineComponent } from "vue";
import { RouterView } from "vue-router";
export const App = defineComponent({
  setup() {
    return () => (
      <div class={"page"}>
        <RouterView />
      </div>
    );
  },
});
