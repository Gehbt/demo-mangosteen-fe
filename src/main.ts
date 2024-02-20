import { App } from "./App";
import "./App.scss";
import { createRouter } from "vue-router";
import { routes } from "@/routes";
import { history } from "@/routes/history";
// import "vant/lib/index.css";
import "virtual:svg-icons-register";
import { createHead, VueHeadMixin } from "@unhead/vue";
import { useMeStore } from "./stores";
const router = createRouter({ history, routes });
const pinia = createPinia();
const head = createHead();
const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  // navigator.sendBeacon("url");
  console.log(
    "unhandled error:",
    err,
    ",\ninstance Name:",
    instance?.$options.name,
    ",\ninfo:",
    info
  );
};
app.use(pinia);
app.use(router);
app.use(head);
app.mixin(VueHeadMixin);

// 使用 svg-icon 这句很重要{可以用 h , 在setup 返回前 捕获(:=) }不然则是 源代码
app.component("svg-icon", SvgIcon); // 使用 SvgIcon 是因为 unplugin-vue-components 对 .vue 自动生成, 且对tsx无效

const meStore = useMeStore();
router.beforeEach(async (to, from) => {
  if (
    ["/", "/start"].includes(to.path) ||
    to.path.startsWith("/welcome") ||
    to.path.startsWith("/sign_in")
  ) {
    return () => {};
  } else {
    return meStore.fetchMe.then(
      () => {},
      // TODO: use `URLSearchParams` && `decodeURIComponent`
      () => "/sign_in?return_to=" + to.path
    );
  }
});
app.mount("#app");
