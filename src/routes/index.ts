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
        name:"hiding",
        path: "0",
        component: Dsetup,
      },
      {
        name:"w1",
        path: "1",
        component: W1,
      },
      {
        name:"w2",
        path: "2",
        component: W2,
      },
      {
        name:"w3",
        path: "3",
        component: W3,
      },
      {
        name:"w4",
        path: "4",
        component: W4,
      },
    ],
  },
  // { path: "/r", component: Ur , name:"useRender"},
];
