const vscode = require("vscode");
const path = require("path");
const utils = require("./util");
const fs = require("fs");

const config = vscode.workspace.getConfiguration("ynw");
const jsonIgnore = config.get("jsonIgnore");
const jsonName = config.get("jsonName") + ".json";

let result = [];

const uuid = () => {
  const now = Date.now();
  const num = Math.floor(Math.random() * 10000 * 1000);
  return `${now}${num}`;
};

module.exports = async function(URI) {
  const filePath = URI.fsPath;
  const stat = await utils.stat(filePath);
  const isDir = stat.isDirectory();
  if (isDir) {
    result = [];
    const target = path.join(filePath, jsonName);
    gen(filePath, { rel: "", pid: "0" });

    fs.writeFile(target, JSON.stringify(result), err => {
      if (err) {
        console.log(err);
        return;
      }
      vscode.window.showInformationMessage("create JSON: OK");
    });
  }
};

const ignoreReg = new RegExp(jsonIgnore);
function shouldIgnore(name, isDir) {
  const a = ignoreReg.test(name);
  const b = name == jsonName;
  const c = name == "node_modules";
  const d = name == "index.html";
  const e = !isDir && !/\.html$/.test(name);
  return a || b || c || d || e;
}

function gen(folder, inject) {
  const files = fs.readdirSync(folder);

  for (var name of files) {
    const filePath = path.join(folder, name);
    const stat = fs.statSync(filePath);
    const isDir = stat.isDirectory();

    if (shouldIgnore(name, isDir)) {
      continue;
    }

    const bundlePath = path.join(filePath, "dist/index.bundle.js");
    const isPlain = isDir && fs.existsSync(bundlePath);

    const id = uuid();
    result.push({ name, id, isDir, ...inject, isPlain });
    const rel = inject && inject.rel ? `${inject.rel}/${name}` : name;

    if (isDir) {
      gen(filePath, { pid: id, rel });
    }
  }
}
