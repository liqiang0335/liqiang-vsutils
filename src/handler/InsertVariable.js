const vscode = require("vscode");
const axios = require("axios");

// 读取配置
const apiUrl = vscode.workspace.getConfiguration("liqiang").get("apiUrl");



/**
 * 插入变量
 * - 读取上一行文本，如果有中文则使用中文，否则使用剪贴板内容
 */
module.exports = async function () {
  const editor = vscode.window.activeTextEditor;

  // 读取剪贴板内容
  let source = ''

  // 读取上一行文本
  let lineAbove = editor.document.lineAt(editor.selection.active.line - 1).text;

  const matchChinese = lineAbove.match(/[\u4e00-\u9fa5]+$/);
  if (matchChinese) {
    source = matchChinese[0].trim();
  } else {
    source = await getContentFromClipboard();
  }

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


/**
 * 从剪贴板获取内容
 */
async function getContentFromClipboard() {
  let clipboardContent = await vscode.env.clipboard.readText();
  // 检测剪贴板是否有文字
  if (!clipboardContent) {
    vscode.window.showInformationMessage("剪贴板没有内容");
    return "";
  }

  const source = clipboardContent.trim();
  return source;
}
