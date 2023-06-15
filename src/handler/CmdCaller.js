const vscode = require("vscode");
const getLocalFile = require("../utils/getLocalFile");
const { exec } = require("child_process");

const call_terminal = (cmd, name) => {
  const terminal = vscode.window.createTerminal({ name });
  terminal.show(true);
  terminal.sendText(cmd);
};

const call_exec = (cmd, Commmand) => {
  exec(cmd, (err) => {
    err
      ? vscode.window.showErrorMessage(`${err}`) //
      : vscode.window.showInformationMessage(`${Commmand}: OK`);
  });
};

module.exports = function (URI, Commmand) {
  let filePath = URI?.fsPath || vscode.window.activeTextEditor.document.uri.path;
  const handler = getLocalFile("yy-handler.js");
  const config = vscode.workspace.getConfiguration("liqiang");

  // 从VSCode配置中读取用户自定义命令
  if (Commmand === "UserDefined") {
    const userDefined = config.get("command");
    Commmand = userDefined;
  }

  const runType = config.get("runType");
  const cmd = `node "${handler}" "${filePath}" ${Commmand}`;

  if (runType === "terminal") {
    call_terminal(cmd, "CmdCaller");
  } else {
    call_exec(cmd, Commmand);
  }
};
