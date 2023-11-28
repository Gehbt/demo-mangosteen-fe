import { ItemsCreate, ItemsList } from "@/components/ItemsList";
import { TagsCreate, TagsEdit } from "@/components/TagsEdit";
import { usedRender } from "@/components/usedRender";
import { Items } from "@/views/Items";
import { SignIn } from "@/views/SignIn";
import { Start } from "@/views/Start";
import { Tag } from "@/views/Tag";
import { Dsetup } from "@components/Dsetup";
import { W1, WFooter, W2, W3, W4, WEndFooter } from "@components/welcome";
import { Welcome } from "@views/Welcome";
import { RouteRecordRaw } from "vue-router";
const WelcomeTable: RouteRecordRaw[] = [
  {
    name: "hiding",
    path: "0",
    components: { main: Dsetup, footer: WEndFooter },
  },
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
    component: Welcome,
    children: [
      {
        name: "w",
        path: "",
        redirect: "/welcome/1",
      },
      ...WelcomeTable,
    ],
  },
  { path: "/statistics", component: usedRender, name: "useRender" },
  {
    name: "start",
    path: "/start",
    component: Start,
  },
  {
    name: "items",
    path: "/items",
    component: Items,
    children: [
      {
        name: "itemsList",
        path: "",
        component: ItemsList,
      },
      {
        name: "itemsCreate",
        path: "create",
        component: ItemsCreate,
      },
    ],
  },
  {
    name: "tags",
    path: "/tags",
    component: Tag,
    children: [
      {
        name: "tagsCreate",
        path: "create",
        component: TagsCreate,
      },
      {
        name: "tagsId",
        path: ":id/edit",
        component: TagsEdit,
      },
    ],
  },
  {
    name: "signIn",
    path: "/sign_in",
    component: SignIn,
  },
];
