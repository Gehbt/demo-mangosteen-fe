import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import Inspect from "vite-plugin-inspect";
import VueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import { VueRouterAutoImports } from "unplugin-vue-router"; // can`t use in nod 18.17.x-
// import svg from "vite-plugin-svgo";
import VueRouter from "unplugin-vue-router/vite";
import vueMacros from "unplugin-vue-macros/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";

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
const env = loadEnv("dev", process.cwd(), "LOCAL_");
// https://vitejs.dev/config/
export default defineConfig({
  // base:"/mangosteen-fe/dist/", // build path in github
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd()), "src/assets/icons/filter"],
      symbolId: "icon-[dir]-[name]",
    }),
    VueRouter({
      routesFolder: ["src/views"],
      extensions: [".vue", ".tsx"],
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
    AutoImport({
      vueTemplate: true,
      dts: true,
      resolvers: [VantResolver()],
      imports: [
        VueRouterAutoImports,
        "vue",
        "pinia",
        "@vueuse/core",
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
    Components({
      resolvers: [VantResolver()],
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
