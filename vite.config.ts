import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import Inspect from 'vite-plugin-inspect'
import VueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'// can`t use in nod 18.17.x-
// import svg from 'vite-plugin-svgo'
import VueRouter from 'unplugin-vue-router/vite'
import vueMacros from 'unplugin-vue-macros/vite'
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};
const alias: Record<string, string> = {
  "@": pathResolve("./src"),
  "@components": pathResolve("./src/components"),
  "@views": pathResolve("./src/views"),
};

// https://vitejs.dev/config/
export default defineConfig({
  // base:"/mangosteen-fe/dist/", // build path in github
  plugins: [
    VueRouter({
      routesFolder:"src/views",
      extensions: ['.vue','.tsx'],
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
    // vueJsx({
    //   transformOn: true,
    //   mergeProps: true,
    // }),
    Inspect(),
    VueDevTools(),
    // svg({
    // })
    AutoImport({
      dts: true,
      imports: [
        VueRouterAutoImports,
        {
          'vue-router/auto': ['./src/views',"./src/components"]
        }
      ],
    })
  ],
  resolve: {
    alias,
  },
});
