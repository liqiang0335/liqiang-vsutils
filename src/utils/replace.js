const vscode = require("vscode");

module.exports = function(content) {
  const editor = vscode.window.activeTextEditor;
  const { start, end } = editor.selection;
  const range = new vscode.Range(start, end);
  editor.edit(editBuilder => {
    editBuilder.replace(range, content);
  });
};
