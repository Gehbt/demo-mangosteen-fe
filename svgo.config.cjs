/**
 * @type {import("svgo").Config} type - description
 */
module.exports = {
  path: "./src/assets/icons",
  plugins: [
    "cleanupAttrs",
    "removeComments",
    "removeXMLProcInst",
    "removeDoctype",
    "removeUselessStrokeAndFill",
    "removeStyleElement",
    "removeTitle",
    {
      name: "removeAttrs",
      params: {
        attrs:
          "(width|height|xmlns|stroke|fill|class|version|fill-rule|xmlns.*|xml.*)",
      },
    },
    {
      name: "mergePaths",
      params: {
        force: true,
      },
    },

    // https://juejin.cn/post/7297061712339451930
  ],
};
