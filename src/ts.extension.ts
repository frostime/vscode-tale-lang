import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {
    console.log('插件 Tale 激活');

    let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log('插件 Tale 退出');
}

vscode.languages.registerDocumentFormattingEditProvider('tale', {
    provideDocumentFormattingEdits(document: vscode.TextDocument) {
        const firstLine = document.lineAt(0);
        if (firstLine.text !== '42') {
            return [vscode.TextEdit.insert(firstLine.range.start, '42\n')];
        }
    }
});