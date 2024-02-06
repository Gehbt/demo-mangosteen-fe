import { readFileSync, readdirSync, writeFile } from "node:fs";
import { basename } from "node:path";
// gather File export
// assembly
const command = "ls -d ./src/*/";
// ./src/assets  ./src/components   ./src/layouts  ./src/scripts  ./src/views
// ./src/batch   ./src/composables  ./src/routes   ./src/shared   ./src/vite_plugins
const doDir = ["composables", "shared", "mock"];
let exludeFile = ["index", "type"];
doDir.map((dir) => {
  const dir_list = readdirSync("./src/" + dir).map((p) => basename(p, ".ts"));
  const asm = dir_list.map((file) => {
    // 不为一些文件生成导出
    if (exludeFile.includes(file)) {
      // just for fun
      exludeFile = exludeFile.filter((ef) => ef !== file);
      return;
    }
    return `export * from './${file}'\n`;
  });

  writeFile(`./src/${dir}/index.ts`, asm.join(""), (err) => {
    if (err) throw err;
  });
});
console.log(`generated for \`${doDir.join()}\`
# ---------------------------------------------------------------------------- #
#                        The export index generated!                           #
# ---------------------------------------------------------------------------- #`);
// gen `index.ts`
// ---
// export * from "./..."
// ...
