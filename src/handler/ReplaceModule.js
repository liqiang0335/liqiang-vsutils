const vscode = require("vscode");
const { copy } = require("copy-paste");

module.exports = async function () {
  const editor = vscode.window.activeTextEditor;
  const content = editor.document.lineAt(editor.selection.active.line).text;

  // 匹配斜杠后面的单词
  let matchTarget = content.match(/\/(\w+)/);
  if (!matchTarget) {
    return vscode.window.showErrorMessage("No target found");
  }
  let target = matchTarget[1];
  if (/s$/.test(target)) {
    target = "{ }";
  }
  const newContent = content.replace(/(const|import)\s+\w+/, `$1 ${target}`);
  await vscode.commands.executeCommand("editor.action.deleteLines");

  const position = editor.selection.end;
  editor.edit((editBuilder) => {
    editBuilder.insert(position, newContent + "\n");
    copy(target);
  });
};
