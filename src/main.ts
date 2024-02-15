import { createApp } from "vue";
import { App } from "./App";
import "./App.scss";
import { createRouter } from "vue-router";
import { routes } from "@/routes";
import { history } from "@/routes/history";
// import "vant/lib/index.css";
import "virtual:svg-icons-register";
import { fetchMe, refreshState } from "./shared/me";
import { createHead, VueHeadMixin } from "@unhead/vue";
// const history = createWebHashHistory();
// 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
const router = createRouter({ history, routes });
fetchMe();
router.beforeEach(async (to, from) => {
  if (
    ["/", "/start"].includes(to.path) ||
    to.path.startsWith("/welcome") ||
    to.path.startsWith("/sign_in")
  ) {
    return true;
  } else {
    return refreshState!.then(
      () => {
        return true;
      },
      // TODO: use `URLSearchParams` && `decodeURIComponent`
      () => "/sign_in?return_to=" + to.path
    );
  }
});
const app = createApp(App);
const head = createHead();

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
app.use(router);
// 使用 svg-icon 这句很重要{可以用 h , 在setup 返回前 捕获(:=) }不然则是 源代码
app.component("svg-icon", SvgIcon); // 使用 SvgIcon 是因为 unplugin-vue-components 对 .vue 自动生成

app.use(head);
app.mixin(VueHeadMixin);
app.mount("#app");
