const vscode = require("vscode");
const path = require("path");
const utils = require("./util");

module.exports = async function(URI) {
  const filePath = URI
    ? URI.fsPath
    : vscode.window.activeTextEditor.document.fileName;
  const stat = await utils.stat(filePath);
  const fileType = stat.isDirectory() ? "dir" : "file";

  const fileTypeHandler = {
    file() {
      const dirname = path.dirname(filePath);
      const name = path.basename(filePath).match(/^\w+/)[0];
      const config = vscode.workspace.getConfiguration("ynw");
      const ext = config.get("styleFileType");
      const fullName = name + "." + ext;
      const target = path.join(dirname, fullName);
      const content = `.${name} {\n\n}`;
      return { target, content };
    },
    dir() {
      const name = filePath.match(/\w+$/)[0];
      const target = path.join(filePath, name + ".js");
      const content = `import React from "react";\n`;
      return { target, content };
    }
  };

  const { content, target } = fileTypeHandler[fileType]();
  const exist = await utils.exists(target);
  if (!exist) {
    await utils.writeFile(target, content);
  }
};
