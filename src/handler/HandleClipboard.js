const path = require("path");
const vscode = require("vscode");
const fs = require("fs");

module.exports = async function (URI) {
  let filePath = URI?.fsPath || vscode.window.activeTextEditor.document.uri.path;
  let clipboardContent = await vscode.env.clipboard.readText();

  // 如果是windows系统, 去掉路径前的"/"
  if (process.platform === "win32") {
    filePath = filePath.replace(/^\//, "");
  }
  let fileContent = fs.readFileSync(filePath, "utf-8");

  const ctx = {
    filePath,
    fileContent,
  };

  let contents = "";
  try {
    contents = JSON.parse(clipboardContent);
    if (!contents) {
      vscode.window.showErrorMessage("剪切板中数据为空");
      return;
    }
    if (!contents?.copytype) {
      vscode.window.showErrorMessage("未匹配到copytype");
      return;
    }
    const { copytype } = contents;
    if (!handlers[copytype]) {
      vscode.window.showErrorMessage("未匹配到copytype对应的处理函数: " + copytype);
      return;
    }
    handlers[copytype](contents, ctx);
  } catch (error) {
    vscode.window.showErrorMessage("剪切板中的内容不是JSON格式");
    return;
  }
};

const handlers = {
  Frame(contents, ctx) {
    const { data, dev } = contents;
    if (!Array.isArray(data) || !data.length) {
      vscode.window.showErrorMessage("data 数组为空");
      return;
    }
    let { filePath, fileContent } = ctx;
    for (let item of data) {
      const { name, x, y, w, h } = item;
      const size = `${x}-${y}-${w}-${h}`;
      const reg = new RegExp(`<Frame\\s*name="${name}"\\s*size="(.+?)"`);
      // 如果数据中包含dev字段,显示每个Frame的匹配信息
      if (dev) {
        const match = fileContent.match(reg);
        if (!match) {
          vscode.window.showErrorMessage(`未匹配到${name}对应的Frame`);
          continue;
        }
      }
      fileContent = fileContent.replace(reg, `<Frame name="${name}" size="${size}"`);
    }
    fs.writeFileSync(filePath, fileContent);
    vscode.window.showInformationMessage("Frame处理完成");
  },
  Move(contents, ctx) {
    const { data } = contents;
    if (!Array.isArray(data) || !data.length) {
      return vscode.window.showErrorMessage("data 数组为空");
    }
    let { filePath, fileContent } = ctx;
    for (let item of data) {
      const { name, x, y, w, h, r } = item;
      const size = [x, y, w, h, r].join(",");
      const reg = new RegExp(`yname="${name}"\\s*size="(.+?)"`, "g");
      fileContent = fileContent.replace(reg, `yname="${name}" size="${size}"`);
    }
    fs.writeFileSync(filePath, fileContent);
    vscode.window.showInformationMessage("Move OK");
  },
};
