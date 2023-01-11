const { copy, paste } = require("copy-paste");
const vscode = require("vscode");

module.exports = function () {
  paste((_, text) => {
    const after = text
      .replace(/[\r\n]+/g, "@@@")
      .replace(/\s+/g, "")
      .replace(/@@@/g, "\n");
    copy(after);
    vscode.window.showInformationMessage("RemoveBlank: OK");
  });
};
