const path = require("path");
const utils = require("./util");

module.exports = async function(URI) {
  const filePath = URI.fsPath;

  const resolve = name => path.join(filePath, name);
  const script = resolve("index.js");
  const scss = resolve("index.scss");
  const markdown = resolve("index.md");

  const exist = await utils.exists(markdown);
  if (!exist) {
    await utils.writeFile(script, "");
    await utils.writeFile(scss, "");
    await utils.writeFile(markdown, "");
  }
};
