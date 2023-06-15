const vscode = require("vscode");
const getLocalFile = require("../utils/getLocalFile");

const exec = (cmd, name) => {
  const terminal = vscode.window.createTerminal({ name });
  terminal.show(true);
  terminal.sendText(cmd);
};

module.exports = function (URI, Commmand) {
  let filePath = URI?.fsPath || vscode.window.activeTextEditor.document.uri.path;
  const handler = getLocalFile("yy-handler.js");

  // 从VSCode配置中读取用户自定义命令
  if (Commmand === "UserDefined") {
    const config = vscode.workspace.getConfiguration("liqiang");
    const userDefined = config.get("command");
    Commmand = userDefined;
  }

  exec(`node "${handler}" "${filePath}" ${Commmand}`, "CmdCaller");
};
