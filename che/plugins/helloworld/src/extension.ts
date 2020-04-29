import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let helloDisposable = vscode.commands.registerCommand('helloworld.sayHello', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello by RADON!');
	});

	let byeDisposable = vscode.commands.registerCommand('helloworld.sayGoodbye', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage('Goobye! Hope to see you soon!');
	});

	context.subscriptions.push(helloDisposable);
	context.subscriptions.push(byeDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
