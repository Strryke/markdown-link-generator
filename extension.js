// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const axios = require("axios");
require("dotenv").config({ path: __dirname + "/.env" });

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "markdown-link-generator.helloWorld",
    async function () {
      console.log(process.env);
      // The code you place here will be executed every time your command is executed
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("editor does not exist");
        return;
      }
      let link = editor.document.getText(editor.selection);
      // vscode.window.showInformationMessage(`selected text: ${text}`);
      let query = await vscode.window.showInputBox({
        prompt: "Enter search query",
        value: link,
      });

      // @ts-ignore
      const res = await axios(
        `https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&q=${query}&cx=56d2a616bcb3922eb`
      );

      const quickPick = vscode.window.createQuickPick();
      quickPick.items = res.data.items.map((e) => ({
        label: e.link,
        description: e.title,
      }));
      quickPick.onDidChangeSelection(([item]) => {
        if (item) {
          // vscode.window.showInformationMessage(item.label);
          editor.edit((edit) => {
            console.log(editor.selection);
            edit.replace(editor.selection, `[${link}](${item.label})`);
          });
          quickPick.dispose();
        }
      });
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
