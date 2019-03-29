const { copy, paste } = require("copy-paste");
const vscode = require("vscode");

module.exports = function() {
  const { window } = vscode;
  paste((_, text) => {
    const after = text
      .replace(/[\r\n]+/g, "@@@")
      .replace(/\s+/g, "")
      .replace(/@@@/g, "\n");
    copy(after);
    window.showInformationMessage("Remove Blank OK");
  });
};
