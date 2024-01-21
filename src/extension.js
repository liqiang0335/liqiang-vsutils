const vscode = require("vscode");
const RemoveBlank = require("./handler/RemoveBlank");
const SaveImage = require("./handler/SaveImage");
const ReplaceModule = require("./handler/ReplaceModule");
const CmdCaller = require("./handler/CmdCaller");
const HandleClipboard = require("./handler/HandleClipboard");
const InsertVariable = require("./handler/InsertVariable");
const BunRunThis = require("./handler/BunRunThis");

/**
 * activate
 */
exports.activate = function (context) {
  const subscriptions = context.subscriptions;
  const commands = vscode.commands;

  const CmdCallerItems = [
    "CopyPathMd5",
    "CopyRelativePages", // 相对Pages路径
    "SplitBookJSON",
    "CreateBookJSON",
    "UserDefined",
    "MarkdownToHTML",
  ];
  CmdCallerItems.forEach((item) => {
    subscriptions.push(commands.registerCommand(`liqiang.${item}`, (URI) => CmdCaller(URI, item)));
  });

  subscriptions.push(commands.registerCommand("liqiang.BunRunThis", (URI) => BunRunThis(URI, "bun")));
  subscriptions.push(commands.registerCommand("liqiang.NodeRunThis", (URI) => BunRunThis(URI, "node")));

  subscriptions.push(commands.registerCommand("liqiang.InsertVariable", InsertVariable));
  subscriptions.push(commands.registerCommand("liqiang.HandleClipboard", HandleClipboard));
  subscriptions.push(commands.registerCommand("liqiang.ReplaceModule", ReplaceModule));
  subscriptions.push(commands.registerCommand("liqiang.SaveImage", SaveImage));
  subscriptions.push(commands.registerCommand("liqiang.removeBlank", RemoveBlank));
};

/**
 * deactivate
 */
exports.deactivate = function () {};
