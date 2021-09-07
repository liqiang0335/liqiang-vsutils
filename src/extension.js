const vscode = require("vscode");
const FileFactory = require("./handler/FileFactory");
const CreateJsonFile = require("./handler/CreateJsonFile");
const CreateIndexFiles = require("./handler/CreateIndexFiles");
const CreateWXMFiles = require("./handler/CreateWXMFiles");
const RemoveBlank = require("./handler/RemoveBlank");
const FileHandler = require("./handler/FileHandler");

/**
 * activate
 */
exports.activate = function (context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("liqiang.removeBlank", RemoveBlank)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("liqiang.fileFactory", FileFactory)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("liqiang.fileHandler", FileHandler)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("liqiang.createJson", CreateJsonFile)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "liqiang.createIndexFiles",
      CreateIndexFiles
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("liqiang.createWXMFiles", CreateWXMFiles)
  );

  ////////////////////// END ///////////////////////
};

/**
 * deactivate
 */
exports.deactivate = function () {};
