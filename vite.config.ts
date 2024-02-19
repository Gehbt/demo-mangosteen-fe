import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { dirname, resolve } from "path";
import Inspect from "vite-plugin-inspect";
import VueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import { VueRouterAutoImports } from "unplugin-vue-router"; // can`t use in nod 18.17.x-
// import svg from "vite-plugin-svgo";
import VueRouter from "unplugin-vue-router/vite";
import vueMacros from "unplugin-vue-macros/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import Components from "unplugin-vue-components/vite";
import { fileURLToPath } from "url";

const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};
const alias: Record<string, string> = {
  "@": pathResolve("./src"),
  "@components": pathResolve("./src/components"),
  "@views": pathResolve("./src/views"),
  "@svg_map": pathResolve("./src/assets/jsons/svg_map.json"),
  "@type_svg_map": pathResolve("./src/assets/jsons/type_svg_map.ts"),
  "@emoji_list": pathResolve("./src/assets/jsons/emoji_list.ts"),
};
const dir = dirname(fileURLToPath(import.meta.url));

const env = loadEnv("dev", dir, "LOCAL_");
// https://vitejs.dev/config/
export default defineConfig({
  // base:"/mangosteen-fe/dist/", // build path in github
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [dir, "src/assets/icons/filter"],
      symbolId: "icon-[dir]-[name]",
    }),
    VueRouter({
      routesFolder: ["src/views"],
      extensions: [".vue", ".tsx"],
      _inspect: true,
    }),
    vueMacros({
      plugins: {
        vue: vue({
          include: [/\.vue$/, /\.setup\.[cm]?[jt]sx?$/],
        }),
        vueJsx: vueJsx({
          transformOn: true,
          mergeProps: true,
        }), // if needed
      },
    }),
    // vue()
    // vueJsx({
    //   transformOn: true,
    //   mergeProps: true,
    // }),
    Inspect(),
    VueDevTools(),
    // svg({
    // })
    Components({
      dts: true,
      include: [/\.vue$/, /\.tsx$/],
    }),
    AutoImport({
      vueTemplate: true,
      dts: true,
      imports: [
        "vue",
        "pinia",
        "vue/macros",
        VueRouterAutoImports,
        {
          "@vueuse/router": ["useRouteQuery", "useRouteParams"],
          "@vueuse/core": [
            "templateRef", // 是坑,不能取代ref(caseof echarts and useswpier) <- (解决:原因为 此时return的html上的ref只能使用字符串(创建时的字符串)而不是ref对象)
            "useCurrentElement", // log element in console, but in vue_reactive
            "syncRef", // double-ended computed
            "reactiveComputed", // conputed for `reactive()`
            "refDefault", // computed but `?? "default"`
            "reactify", // compose(apply) `Function` to reactive
            "extendRef", // ref对象不止步于 .value
            "isDefined", //  replace `!refValue.value` to isDefined(refValue.value)
            "makeDestructurable", // support `let { foo, bar } = obj` & `let [foo, bar] = obj`
            "useCloned", // Reactive deep_clone of a ref
            "useCounter", // @util: builtin counter
            "useMemoize", // middleware(apply function) for ref and catch method
            "useCycleList", // @util: builtin cycle-list
            "useToggle", // @uitl: bool-switch
            "useVModel", // junior(次级)/transfer(中转) v-model
            "useRefHistory", // ref change memo
            "useStorage", // 在不使用LocalStorage 或 SessionStorage 之外 的Storage时才用到,
            "useMousePressed", // pressEvent in any scope
            "useLocalStorage", // 相比useStorage 更语义化
            "useSessionStorage", // 相比useStorage 更语义化
          ],
        },
        {
          from: "@type_svg_map",
          imports: ["svgs"],
        },
        {
          from: "@components/SvgIcon.vue",
          imports: [["default", "SvgIcon"]],
        },
        {
          axios: [
            // default imports
            ["default", "axios"], // import { default as axios } from 'axios',
          ],
        },
        {
          superjson: [["default", "superjson"]],
        },
        {
          from: "vue-types",
          imports: [
            "any",
            "func",
            "bool",
            "string",
            "number",
            "array",
            "integer",
            "symbol",
            "object",
            "nullable",
          ],
        },
        // {
        //   from: "@components/SvgIcon.tsx",
        //   imports: [["SvgIcons", "SvgIconTsx"]],
        // },
      ],
    }),
  ],
  resolve: {
    alias,
  },
  server: {
    cors: true,
    proxy: {
      "/api/v1": {
        changeOrigin: true,
        target: "http://192.168.0.247:3001",
        rewrite: (path) => path.replace(/^\/api\/v1/, ""),
      },
      "/api/tph": {
        changeOrigin: true,
        target: "https://jsonplaceholder.typicode.com/",
        // http://localhost:5173/api/tph -> http://jsonplaceholder.typicode.com/
        // rewrite: (path) => path.replace(/^\/api/tph, ""),
      },
    },
  },
});
