const { window, workspace } = require("vscode");
const path = require("path");
const utils = require("./util");
const fs = require("fs");
const { exec } = require("child_process");
const { copy } = require("copy-paste");

const config = workspace.getConfiguration("liqiang");
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
  if (!stat.isDirectory()) {
    return;
  }
  result = [];
  const target = path.join(filePath, jsonName);
  gen(filePath, { rel: "", pid: "0" });
  await utils.writeFile(target, JSON.stringify(result));
  createIndexFile({ folder: filePath, jsonPath: target });
};

async function createIndexFile({ folder }) {
  const CONFIG_NAME = "_config.json";
  const configPath = path.join(folder, CONFIG_NAME).replace(/\\+/g, "\\\\");
  const cwd = workspace.workspaceFolders[0].uri.path;
  const scriptPath = path
    .join(cwd, "./_script/bookCreator/dist/index.bundle.js")
    .replace(/^\\+/, "");

  if (fs.existsSync(configPath)) {
    const cmd = `node "${scriptPath}" "${configPath}"`;
    copy(cmd);
    exec(cmd, err => {
      err
        ? window.showErrorMessage(`${err}`)
        : window.showInformationMessage("createJSON: OK");
    });
  } else {
    window.showErrorMessage("'_config.json' NOT FOUND");
  }
}

const ignoreReg = new RegExp(jsonIgnore);
function shouldIgnore(name, isDir) {
  // ignore config file
  const a = isDir && ignoreReg.test(name);
  const b = name == jsonName;
  const c = name == "node_modules";
  // ignore not md file
  const d = !isDir && !/\.md$/.test(name);
  const result = a || b || c || d;
  return result;
}

function gen(folder, inject) {
  const files = fs.readdirSync(folder);

  for (let name of files) {
    const filePath = path.join(folder, name);
    const stat = fs.statSync(filePath);
    const isDir = stat.isDirectory();

    if (shouldIgnore(name, isDir)) {
      continue;
    }

    name = name.replace(/\.md$/, ".html");

    const bundlePath = path.join(filePath, "index.js");
    const isPlain = isDir && fs.existsSync(bundlePath);

    const id = uuid();
    result.push({ name, id, isDir, ...inject, isPlain, mtime: stat.mtimeMs });
    const rel = inject && inject.rel ? `${inject.rel}/${name}` : name;

    if (isDir) {
      gen(filePath, { pid: id, rel });
    }
  }
}
