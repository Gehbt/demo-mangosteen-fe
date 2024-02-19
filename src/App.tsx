import type { HeadType } from "DefineHeadType";
import { RouterView } from "vue-router";
export const App = defineComponent({
  name: "App",
  setup() {
    return () => (
      <div class={"page"}>
        <RouterView />
      </div>
    );
  },
  head: {
    title: "蓝莓记账",
    link: [
      // vant样式
      {
        rel: "stylesheet",
        href: "https://fastly.jsdelivr.net/npm/vant@4/lib/index.css",
      },
    ],
  } as HeadType,
});
