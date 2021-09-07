const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const getLocalFile = require("../utils/getLocalFile");

const exec = (cmd, name) => {
  const terminal = vscode.window.createTerminal({ name });
  terminal.show(true);
  terminal.sendText(cmd);
};

module.exports = function () {
  const active = vscode.window.activeTextEditor.document.fileName;
  const runFile = getLocalFile("ynw-file-handler.js");
  exec(`node "${runFile}" "${active}"`, "处理文件");
};
