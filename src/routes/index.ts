import { Dsetup } from "@/components/Dsetup";
import { W1, W2, W3, W4 } from "@/components/welcome";
import { Welcome } from "@/views/Welcome";
import { RouteRecordRaw } from "vue-router";
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
      {
        path: "0",
        component: Dsetup,
      },
      {
        path: "1",
        component: W1,
      },
      {
        path: "2",
        component: W2,
      },
      {
        path: "3",
        component: W3,
      },
      {
        path: "4",
        component: W4,
      },
    ],
  },
  // { path: "/r", component: Ur , name:"useRender"},
];
