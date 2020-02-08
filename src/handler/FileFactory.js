const vscode = require("vscode");
const path = require("path");
const util = require("./util");
const { copy } = require("copy-paste");
const { exec } = require("child_process");

module.exports = async function(URI) {
  const { workspace, window } = vscode;
  const selectPath = URI
    ? URI.fsPath
    : window.activeTextEditor.document.fileName;

  const cwd = workspace.workspaceFolders[0].uri.path;
  const ext = path.extname(selectPath).replace(".", "");
  const handlerName = `ynw-${ext}-factory.js`;
  const handlerPath = path
    .join(cwd, handlerName)
    .replace(/\\+/g, "\\\\")
    .replace(/^\\+/, "");
  const exist = await util.exists(handlerPath);

  if (exist) {
    const cmd = `node ${handlerPath} "${util.toWinPath(selectPath)}"`;
    copy(cmd);
    exec(cmd, err => {
      if (err) return console.log(err);
      window.showInformationMessage("File-Factory: OK");
    });
  } else {
    window.showErrorMessage("File-Factory: Not Found!");
  }
};
