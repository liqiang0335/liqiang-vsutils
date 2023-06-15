const { copy, paste } = require("copy-paste");
const vscode = require("vscode");

module.exports = function () {
  paste((_, text) => {
    let after = text
      .replace(/[\r\n]+/g, "@@@")
      .replace(/\s+/g, "")
      .replace(/@@@/g, "\n");

    after = after
      .replace(/,/g, "，") //
      .replace(/:/g, "：");

    copy(after);
    vscode.window.showInformationMessage("RemoveBlank: OK");
  });
};
