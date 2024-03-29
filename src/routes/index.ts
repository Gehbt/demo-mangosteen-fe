import { ItemsCreate, ItemsList } from "@/components/ItemsList";
import { SwiperView } from "@/components/Swiper";
import { TagsCreate, TagsEdit } from "@/components/TagsEdit";
// import { Export } from "@/views/Export";
// import { Items } from "@/views/Items";
// import { Notify } from "@/views/Notify";
// import { SignIn } from "@/views/SignIn";
// import { Start } from "@/views/Start";
// import { Statistics } from "@/views/Statistics";
// import { Tag } from "@/views/Tag";
// import { Welcome } from "@views/Welcome";
import { W1, WFooter, W2, W3, W4, WEndFooter } from "@components/welcome";
import type { RouteRecordRaw } from "vue-router";
const WelcomeTable: RouteRecordRaw[] = [
  {
    name: "hiding",
    path: "0",
    components: { main: SwiperView, footer: WFooter(0) },
  },
  // TODO: compose and use `scroll-snap`
  {
    name: "w1",
    path: "1",
    components: { main: W1, footer: WFooter(1) },
    meta: { seq: true },
  },
  {
    name: "w2",
    path: "2",
    components: { main: W2, footer: WFooter(2) },
    meta: { seq: true },
  },
  {
    name: "w3",
    path: "3",
    components: { main: W3, footer: WFooter(3) },
    meta: { seq: true },
  },
  {
    name: "w4",
    path: "4",
    components: { main: W4, footer: WEndFooter },
    meta: { seq: true },
  },
];
export const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/welcome", name: "home" },
  // { path: "/about", component: Bar },
  {
    path: "/welcome",
    component: async () => import("@/views/Welcome"),
    children: [
      {
        name: "w",
        path: "",
        redirect: "/welcome/1",
      },
      ...WelcomeTable,
    ],
  },

  {
    name: "start",
    path: "/start",
    component: () => import("@/views/Start"),
  },
  {
    name: "signIn",
    path: "/sign_in",
    component: () => import("@/views/SignIn"),
  },
  {
    name: "Export",
    path: "/export",
    component: () => import("@/views/Export"),
  },
  {
    name: "Notify",
    path: "/notify",
    component: () => import("@/views/Notify"),
  },
  {
    name: "items",
    path: "/items",
    component: import("@/views/Items"),
    children: [
      {
        name: "itemsList",
        path: "",
        component: async () => ItemsList,
      },
      {
        name: "itemsCreate",
        path: "create",
        component: async () => ItemsCreate,
      },
    ],
  },
  {
    name: "tags",
    path: "/tags",
    component: () => import("@/views/Tag"),
    redirect: "/items",
    children: [
      {
        name: "tagsCreate",
        path: "create",
        component: async () => TagsCreate,
      },
      {
        name: "tagsId",
        path: ":id/edit",
        component: async () => TagsEdit,
      },
    ],
  },
  {
    path: "/statistics",
    component: async () => import("@/views/Statistics"),
    name: "statistics",
  },
  {
    name: "NotFound",
    //使用正则的方式，匹配任意的
    path: "/:path(.*)",
    component: () => import("@/components/NotFound.vue"),
  },
];
