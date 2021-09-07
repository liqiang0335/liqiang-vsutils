const vscode = require("vscode");

module.exports = function() {
  const editor = vscode.window.activeTextEditor;
  const selection = editor.selection;
  return editor.document.getText(selection);
};
