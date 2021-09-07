const path = require("path");
const vscode = require("vscode");
const { workspace } = vscode;
/**
 * 获取工作区根目录文件
 */
module.exports = name => {
  return path
    .join(workspace.workspaceFolders[0].uri.path, name)
    .replace(/\\+/, "\\\\")
    .replace(/^\\+/, "");
};
