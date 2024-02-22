import { build, defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { dirname, resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import VueRouter from "unplugin-vue-router/vite";
import vueMacros from "unplugin-vue-macros/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { fileURLToPath } from "url";
import packageJson from "./package.json";
import { visualizer } from "rollup-plugin-visualizer";
import { analyzer } from "vite-bundle-analyzer";

import { brotliCompress } from "zlib";
import { promisify } from "util";
import gzipPlugin from "rollup-plugin-gzip";
const _dirs = dirname(fileURLToPath(import.meta.url));

const brotliPromise = promisify(brotliCompress);
// const env = loadEnv("dev", _dirs, "LOCAL_");
const pathResolve = (dir: string): string => {
  return resolve(_dirs, ".", dir);
};
const alias: Record<string, string> = {
  "@": pathResolve("./src"),
  "@components": pathResolve("./src/components"),
  "@views": pathResolve("./src/views"),
  "@svg_map": pathResolve("./src/assets/jsons/svg_map.json"),
  "@type_svg_map": pathResolve("./src/assets/jsons/type_svg_map.ts"),
  "@emoji_list": pathResolve("./src/assets/jsons/emoji_list.ts"),
  "vue-types": "vue-types/shim",
};

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
    DEBUG: false,
  },
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [_dirs, "src/assets/icons/filter"],
      symbolId: "icon-[dir]-[name]",
    }),
    VueRouter({
      routesFolder: ["src/views"],
      extensions: [".vue", ".tsx"],
    }),
    vueMacros({
      plugins: {
        vue: vue({
          isProduction: true,
        }),
        vueJsx: vueJsx({
          transformOn: true,
          mergeProps: true,
        }), // if needed
      },
    }),
    AutoImport({
      imports: [
        "vue",
        "pinia",
        VueRouterAutoImports,
        {
          "@vueuse/router": ["useRouteQuery", "useRouteParams"],
          "@vueuse/core": [
            "useVModel", // junior(次级)/transfer(中转) v-model
            "useRefHistory", // ref change memo
            "useLocalStorage", // 相比useStorage 更语义化
            "useSessionStorage", // 相比useStorage 更语义化
            "useThrottleFn",
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
      ],
    }),
    gzipPlugin({
      customCompression: (content) => brotliPromise(Buffer.from(content)),
      fileName: ".br",
    }),
    // import.meta.env.MODE !== "prod" &&
    visualizer({
      emitFile: true,
      filename: "stats.html",
      brotliSize: true,
    }),
    // 仅用于manualChunks是函数的形式
    // analyzer(),
    splitVendorChunkPlugin(),
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
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("echarts")) {
            return "echarts";
          } else if (id.includes("vant")) {
            return "vant";
          } else if (id.includes("faker") || id.includes("mock")) {
            return "mock";
          } else if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  esbuild: {
    jsx: "preserve",
    jsxImportSource: "vue",
  },
});
