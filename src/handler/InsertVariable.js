const vscode = require("vscode");
const axios = require("axios");

// 读取配置
const apiUrl = vscode.workspace.getConfiguration("liqiang").get("apiUrl");

module.exports = async function () {
  const editor = vscode.window.activeTextEditor;
  let clipboardContent = await vscode.env.clipboard.readText();

  // 检测剪贴板是否有文字
  if (!clipboardContent) {
    vscode.window.showInformationMessage("剪贴板没有内容");
    return;
  }

  const source = clipboardContent.trim();
  const resp = await axios.get(apiUrl + source);

  if (!resp.data?.content) {
    vscode.window.showInformationMessage("请求失败");
    return;
  }
  let newContent = resp.data.content;
  const position = editor.selection.end;
  editor.edit((editBuilder) => {
    editBuilder.insert(position, newContent + " ");
  });
};
