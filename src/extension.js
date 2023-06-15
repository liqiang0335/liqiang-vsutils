const vscode = require("vscode");
const FileFactory = require("./handler/FileFactory");
const CreateJsonFile = require("./handler/CreateJsonFile");
const CreateIndexFiles = require("./handler/CreateIndexFiles");
const RemoveBlank = require("./handler/RemoveBlank");
const FileHandler = require("./handler/FileHandler");
const SaveImage = require("./handler/SaveImage");
const ReplaceModule = require("./handler/ReplaceModule");
/**
 * activate
 */
exports.activate = function (context) {
  context.subscriptions.push(vscode.commands.registerCommand("liqiang.ReplaceModule", ReplaceModule));
  context.subscriptions.push(vscode.commands.registerCommand("liqiang.SaveImage", SaveImage));
  context.subscriptions.push(vscode.commands.registerCommand("liqiang.removeBlank", RemoveBlank));
  context.subscriptions.push(vscode.commands.registerCommand("liqiang.fileFactory", FileFactory));
  context.subscriptions.push(vscode.commands.registerCommand("liqiang.fileHandler", FileHandler));
  context.subscriptions.push(vscode.commands.registerCommand("liqiang.createJson", CreateJsonFile));
  context.subscriptions.push(vscode.commands.registerCommand("liqiang.createIndexFiles", CreateIndexFiles));
};

/**
 * deactivate
 */
exports.deactivate = function () {};
