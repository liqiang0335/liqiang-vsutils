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
  exec(`node "${handler}" "${filePath}" ${Commmand}`, "CmdCaller");
};
