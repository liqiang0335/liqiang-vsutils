const { copy } = require("copy-paste");
const vscode = require("vscode");
const path = require("path");
const fs = require("fs/promises");
const axios = require("axios");
const insertContent = require("../utils/insertContent");
const child_process = require("child_process");
const scriptPath = path.join(__dirname, "../assets/saveImage.applescript");
const saveURL = "http://app.jsgaotie.com/api/app/public/mybook/content/image";
const FormData = require("form-data");

module.exports = function SaveImage() {
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
      const res = await axios.post(saveURL, form, {
        headers: { ...form.getHeaders() },
      });
      const body = res.data;
      const filePath = body.data;
      const imagePath = `https://app.jsgaotie.com${filePath}`;
      copy(imagePath);
      insertContent(`![](${imagePath})`);
      vscode.window.showInformationMessage("OK");
    } else {
      vscode.window.showWarningMessage("SaveImage:不是图片");
    }
  });
};
