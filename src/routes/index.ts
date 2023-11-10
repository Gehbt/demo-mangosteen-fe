import { Dsetup } from "@components/Dsetup";
import { W1, WFooter, W2, W3, W4, WEndFooter } from "@components/welcome";
import { Welcome } from "@views/Welcome";
import { RouteRecordRaw } from "vue-router";
const WelcomeTable: RouteRecordRaw[] = [
  {
    name: "hiding",
    path: "0",
    components: { main: Dsetup, footer: Dsetup },
  },
  {
    name: "w1",
    path: "1",
    components: { main: W1, footer: WFooter(1) },
  },
  {
    name: "w2",
    path: "2",
    components: { main: W2, footer: WFooter(2) },
  },
  {
    name: "w3",
    path: "3",
    components: { main: W3, footer: WFooter(3) },
  },
  {
    name: "w4",
    path: "4",
    components: { main: W4, footer: WEndFooter },
  },
];
export const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/welcome" },
  // { path: "/about", component: Bar },
  {
    path: "/welcome",
    component: Welcome,
    children: [
      {
        path: "",
        redirect: "/welcome/1",
      },
      ...WelcomeTable,
    ],
  },
  // { path: "/r", component: Ur , name:"useRender"},
];
