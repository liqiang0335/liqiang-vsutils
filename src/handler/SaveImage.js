const { copy } = require("copy-paste");
const vscode = require("vscode");
const path = require("path");
const fs = require("fs/promises");
const axios = require("axios");
const insertContent = require("../utils/insertContent");
const child_process = require("child_process");
const scriptPath = path.join(__dirname, "../assets/saveImage.applescript");
const host = "http://app.jsgaotie.com";
const saveURL = vscode.workspace.getConfiguration("liqiang").get("saveURL");
const FormData = require("form-data");

module.exports = function SaveImage() {
  if (!saveURL) {
    return vscode.window.showErrorMessage("请设置saveURL参数");
  }
  const as = child_process.spawn("osascript", [scriptPath]);
  as.on("error", function () {
    vscode.window.showErrorMessage("SaveImage:出错");
  });
  as.stdout.on("data", async function (data) {
    const output = data.toString().trim();
    if (output !== "NOTIMAGE") {
      const image = await fs.readFile(output);
      const form = new FormData();
      form.append("file", image, "file.jpg");
      const res = await axios.post(host + saveURL, form, {
        headers: { ...form.getHeaders() },
      });
      const body = res.data;
      const imagePath = host + body.data;
      copy(imagePath);
      insertContent(`![](${imagePath})`);
      vscode.window.showInformationMessage("OK");
    } else {
      vscode.window.showWarningMessage("SaveImage:不是图片");
    }
  });
};
