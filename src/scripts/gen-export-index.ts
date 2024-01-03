import { readFileSync, readdirSync, writeFile } from "node:fs";
import { basename } from "node:path";
// gather File export
// assembly
const command = "ls -d ./src/*/";
// ./src/assets  ./src/components   ./src/layouts  ./src/scripts  ./src/views
// ./src/batch   ./src/composables  ./src/routes   ./src/shared   ./src/vite_plugins
const doDir = ["composables", "shared"];
doDir.map((dir) => {
  const dir_list = readdirSync("./src/" + dir).map((p) => basename(p, ".ts"));
  const asm = dir_list.map((file) => {
    if (file === "index") return; // 不为自己生成导出
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
