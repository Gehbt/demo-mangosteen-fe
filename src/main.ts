import { createApp } from "vue";
import { App } from "./App";
import "./App.scss";
import { createRouter } from "vue-router";
import { routes } from "@/routes";
import { history } from "@/routes/history";
import "vant/lib/index.css";
import "virtual:svg-icons-register";
import { fetchMe, refreshState } from "./shared/me";
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
      () => "/sign_in?return_to=" + to.path
    );
  }
});
const app = createApp(App);
app.use(router);
// 使用 svg-icon 这句很重要{可以用 h , 在setup 返回前 捕获(:=) }不然则是 源代码
app.component("svg-icon", SvgIcon); // 使用 SvgIcon 是因为 unplugin-vue-components 对 .vue 自动生成

app.config.errorHandler = (err) => {
  // navigator.sendBeacon("url");
  console.log("Error: " + err);
};
app.mount("#app");
