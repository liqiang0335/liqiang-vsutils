const { window, workspace } = require("vscode");
const path = require("path");
const utils = require("./util");
const fs = require("fs");

const exec = (cmd, name) => {
  const terminal = window.createTerminal({ name });
  terminal.show(true);
  terminal.sendText(cmd);
};

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
  const CMD_NAME = "json-html";
  const configPath = path.join(folder, CONFIG_NAME).replace(/\\+/g, "\\\\");
  const cmd = `node ./_script/bookCreator/dist/index.bundle.js ${configPath}`;
  if (fs.existsSync(configPath)) {
    exec(cmd, CMD_NAME);
  }
}

const ignoreReg = new RegExp(jsonIgnore);
function shouldIgnore(name, isDir) {
  const a = ignoreReg.test(name);
  const b = name == jsonName;
  const c = name == "node_modules";
  const d = /^_?index\.html$/.test(name);
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
    result.push({ name, id, isDir, ...inject, isPlain, mtime: stat.mtimeMs });
    const rel = inject && inject.rel ? `${inject.rel}/${name}` : name;

    if (isDir) {
      gen(filePath, { pid: id, rel });
    }
  }
}
