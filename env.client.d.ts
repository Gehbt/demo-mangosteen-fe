/// <reference path="./components.d.ts" />
/// <reference path="./typed-router.d.ts" />
/// <reference path="./auto-imports.d.ts" />
/// <reference types="unplugin-vue-macros/macros-global" />
/// <reference types="vue-types" />
import "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    // 是可选的
    isAdmin?: boolean;
    // 需要认证
    requiresAuth?: boolean;
    // 顺序
    seq?: boolean;
  }
}
