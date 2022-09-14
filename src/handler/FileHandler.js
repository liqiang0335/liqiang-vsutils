const vscode = require("vscode");
const getLocalFile = require("../utils/getLocalFile");

const exec = (cmd, name) => {
  const terminal = vscode.window.createTerminal({ name });
  terminal.show(true);
  terminal.sendText(cmd);
};

module.exports = function () {
  const active = vscode.window.activeTextEditor.document.fileName;
  const runFile = getLocalFile("yy-file-handler.js");
  exec(`node "${runFile}" "${active}"`, "处理文件");
};
