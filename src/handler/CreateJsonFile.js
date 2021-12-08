const { window, workspace } = require("vscode");
const path = require("path");
const utils = require("./util");
const fs = require("fs");
const { exec } = require("child_process");
const { copy } = require("copy-paste");

const config = workspace.getConfiguration("liqiang");
const jsonIgnore = config.get("jsonIgnore");
const jsonName = config.get("jsonName") + ".json";
const ignoreReg = new RegExp(jsonIgnore);
let result = [];
const uuid = () => {
  const now = Date.now();
  const num = Math.floor(Math.random() * 10000 * 1000);
  return `${now}${num}`;
};
/**
 * ----------------------------------------
 *
 * ----------------------------------------
 */
module.exports = async function (URI) {
  const filePath = URI.fsPath;
  const matchAppName = filePath.match(/app-books[/\\]+(\w+)/);
  const appname = matchAppName ? matchAppName[1] : filePath;
  const stat = await utils.stat(filePath);
  if (!stat.isDirectory()) {
    return;
  }
  result = [];
  const target = path.join(filePath, jsonName);
  gen(filePath, { rel: "", pid: "0", appname });
  await utils.writeFile(target, JSON.stringify(result));
  createIndexFile({ folder: filePath });
};
/**
 * ----------------------------------------
 * 执行脚本创建index.html
 * ----------------------------------------
 */
async function createIndexFile({ folder }) {
  const CONFIG_NAME = "_config.json";
  const configPath = path.join(folder, CONFIG_NAME).replace(/\\+/g, "\\\\");
  const cwd = workspace.workspaceFolders[0].uri.path;

  // 执行脚本创建index.html
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

/**
 * ----------------------------------------
 *  创建__db__.json
 * ----------------------------------------
 */
function gen(folder, inject) {
  const files = fs.readdirSync(folder);

  for (let fileName of files) {
    const filePath = path.join(folder, fileName);
    const stat = fs.statSync(filePath);
    const isDir = stat.isDirectory();

    if (shouldIgnore(fileName, isDir)) {
      continue;
    }

    const id = uuid();
    const bundlePath = path.join(filePath, "index.js");
    const isPlain = isDir && fs.existsSync(bundlePath);
    const name = fileName.replace(/\.md$/, ".html");
    const basename = fileName.replace(/\.md$/, ""); // 不带拓展名的文件名

    const data = {
      id,
      name,
      isDir,
      isPlain,
      basename,
      mtime: stat.mtimeMs,
      ...inject,
    };

    if (isDir) {
      data.frc = {};
      // 文件夹配置信息
      const drc = path.join(filePath, ".drc");
      if (fs.existsSync(drc)) {
        data.drc = JSON.parse(fs.readFileSync(drc, "utf-8"));
      }
    } else {
      // 文件配置信息
      data.frc = {};
      const content = fs.readFileSync(filePath, "utf-8") || "";
      content.replace(/\(\((\w+):([^\)]+)\)\)/g, (match, m1, m2) => {
        data.frc[m1] = m2;
        return "";
      });
    }

    result.push(data);
    const rel = inject && inject.rel ? `${inject.rel}/${name}` : name;

    if (isDir) {
      gen(filePath, { ...inject, pid: id, rel });
    }
  }
}
function shouldIgnore(name, isDir) {
  // 忽略配置文件
  const a = isDir && ignoreReg.test(name);
  const b = name == jsonName;
  const c = name == "node_modules";
  // 忽略非MD文件
  const d = !isDir && !/\.md$/.test(name);
  const result = Boolean(a || b || c || d);
  return result;
}
