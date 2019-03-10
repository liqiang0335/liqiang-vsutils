const vscode = require("vscode");
const CreateSameNameFile = require("./handler/CreateSameNameFile");
const FileFactory = require("./handler/FileFactory");
const CreateJsonFile = require("./handler/CreateJsonFile");

/**
 * activate
 */
exports.activate = function(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("liqiang.fileFactory", FileFactory)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "liqiang.createSameNameFile",
      CreateSameNameFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("liqiang.createJson", CreateJsonFile)
  );

  ////////////////////// END ///////////////////////
};

/**
 * deactivate
 */
exports.deactivate = function() {};
