const vscode = require("vscode");
const ynwconfig = require("./ynwconfig");
const userConfig = vscode.workspace.getConfiguration("ynw");
/**
 * 优先读取 ynw 配置
 */
module.exports = function(key) {
  const local = ynwconfig.vscode || {};
  return local[key] || userConfig.get(key);
};
