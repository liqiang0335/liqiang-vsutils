const vscode = require("vscode");
/**
 * Insert Contnet to Selection
 */
module.exports = function (content) {
  vscode.window.activeTextEditor.edit(editBuilder => {
    let position = vscode.window.activeTextEditor.selection.end;
    editBuilder.insert(position, content);
  });
};
