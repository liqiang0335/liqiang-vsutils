const vscode = require("vscode");
const path = require("path");

const exec = (cmd, name) => {
  const terminal = vscode.window.createTerminal({ name });
  terminal.show(true);
  terminal.sendText(cmd);
};

module.exports = function (URI, command) {
  const relative = vscode.workspace.asRelativePath(URI);
  const basename = path.basename(relative).split(".")[0];

  // 相对跟目录路径
  const rootPath = vscode.workspace.workspaceFolders[0].uri.path;
  const relativePath = path.relative(rootPath, URI.fsPath);
  const cmd = `${command} '${relativePath}'`;
  try {
    exec(cmd, command + ": " + basename);
  } catch (err) {
    vscode.window.showErrorMessage(err.message);
  }
};
