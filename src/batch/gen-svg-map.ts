import { readdirSync, writeFile } from "fs";
import { basename } from "path";
const svg_list = readdirSync("./src/assets/icons")
  .filter((p) => p.endsWith(".svg"))
  .map((p) => basename(p, ".svg"));
const svg_map: object = {};
svg_list.map((item) => {
  Object.assign(svg_map, { [item]: item });
});
JSON.stringify(svg_map);

writeFile("src/assets/jsons/svg_map.json", JSON.stringify(svg_map), (err) => {
  if (err) throw err;
  console.log(
    `# ---------------------------------------------------------------------------- #
#                            The svg map generated!                            #
# ---------------------------------------------------------------------------- #`
  );
});
