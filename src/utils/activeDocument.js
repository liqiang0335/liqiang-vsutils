const vscode = require("vscode");

module.exports = function () {
  const activeDocument = vscode.window.activeTextEditor.document;
  return activeDocument ? activeDocument.uri.fsPath : "";
};
