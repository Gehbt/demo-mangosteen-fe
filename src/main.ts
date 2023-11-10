import { createApp } from "vue";
import { App } from "./App";
import "./App.scss";
import { createRouter } from "vue-router";
import { routes } from "@/routes";
import { history } from "@/shared/history";
import 'virtual:svg-icons-register';
// const history = createWebHashHistory();
// 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
const router = createRouter({history,routes});
const app = createApp(App);
app.use(router);
app.mount("#app");
