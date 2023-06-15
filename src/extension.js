const vscode = require("vscode");
const RemoveBlank = require("./handler/RemoveBlank");
const SaveImage = require("./handler/SaveImage");
const ReplaceModule = require("./handler/ReplaceModule");
const CmdCaller = require("./handler/CmdCaller");

/**
 * activate
 */
exports.activate = function (context) {
  const subscriptions = context.subscriptions;
  const commands = vscode.commands;
  subscriptions.push(commands.registerCommand("liqiang.UserDefined", (URI) => CmdCaller(URI, "UserDefined")));
  subscriptions.push(commands.registerCommand("liqiang.MarkdownToHTML", (URI) => CmdCaller(URI, "MarkdownToHTML")));
  subscriptions.push(commands.registerCommand("liqiang.CreateBookJSON", (URI) => CmdCaller(URI, "CreateBookJSON")));
  subscriptions.push(commands.registerCommand("liqiang.ReplaceModule", ReplaceModule));
  subscriptions.push(commands.registerCommand("liqiang.SaveImage", SaveImage));
  subscriptions.push(commands.registerCommand("liqiang.removeBlank", RemoveBlank));
};

/**
 * deactivate
 */
exports.deactivate = function () {};
