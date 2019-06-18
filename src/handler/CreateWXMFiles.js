const path = require("path");
const utils = require("./util");

module.exports = async function(URI) {
  const filePath = URI.fsPath;
  const fileName = path.basename(filePath);

  const resolve = name => path.join(filePath, name);
  const script = resolve(fileName + ".js");
  const wxcss = resolve(fileName + ".wxss");
  const wxml = resolve(fileName + ".wxml");
  const json = resolve(fileName + ".json");

  const exist = await utils.exists(wxml);
  if (!exist) {
    utils.writeFile(
      script,
      `Page({
       data: {},
       onLoad: function() {}
    });`
    );
    utils.writeFile(wxcss, ".container{\n}");
    utils.writeFile(wxml, `<view class="container">\n\n</view>`);
    utils.writeFile(json, `{"usingComponents": {}}`);
  }
};
