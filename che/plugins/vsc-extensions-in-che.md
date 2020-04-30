# Creating and publishing a VS Code extension into the Che plug-in registry

To get started you need:

* Visual Studio Code to develop the extension. Any other editors are fine as well;
* The Node.js Package Manager npm (see [how to install on Linux](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/));

## Creating the VSC extension

As the VSC documentation is very clear, to avoid being redundant I'll map the action to be taken.

1. First, to create the extension follow these [instructions](https://code.visualstudio.com/api/get-started/your-first-extension). 
2. After that, you should see the following structure inside your project folder:

```
.
├── .vscode
│   ├── launch.json     // Config for launching and debugging the extension
│   └── tasks.json      // Config for build task that compiles TypeScript
├── .gitignore          // Ignore build output and node_modules
├── README.md           // Readable description of your extension's functionality
├── src
│   └── extension.ts    // Extension source code
├── package.json        // Extension manifest
├── tsconfig.json       // TypeScript configuration
```

You need to focus on

* **src/extension.ts**: the entry point to implement the extension;
* **package.json**: the manifest to specify the metadata about the plug-in and the commands to execute, as well as the dependencies need (if any).

However, to run the plugin you have to go inside Visual Studio Code, open the Command Palette (Ctrl+Shift+P) and write Hello World (as shown [here](https://code.visualstudio.com/api/get-started/your-first-extension#developing-the-extension))

What if we want to right-click on a file and select the option to execute within the contex menu?

First, let's edit the object *contributes* in **pakage.json** in the following way:

```
"contributes": {
  "menus": {
   "editor/context": [
     {
       "when": "resourceLangId == yaml",
       "command": "helloworld.helloWorld",
       "group": "myGroup@1"
     }
   ]
 },
 "commands": [
   {
     "command": "helloworld.helloWorld",
     "title": "Say hello"
   }
 ]
}
```

The list "commands" maps the commands executable by the plug-in (e.g. to say hello, to check typos in the code, etc.).
Let's focus on the "menus" object.
It specifies how the commands can be accessed through the user interface.
In this case we defined an "editor/context" which means that the command will be find among the menu items when right-clicking on the window (more can be found [here](https://code.visualstudio.com/api/references/contribution-points#contributes.menus)).

Here

* ```"when": "resourceLangId == yaml"``` applies to menus only when the file extension is .yaml;
* ```"command": "helloworld.helloWorld"``` maps the action to execute, implemented in **extension.ts**; 
* ```"group": "myGroup@1"``` indicates where to show the menu item within the context menu (see [here](https://code.visualstudio.com/api/references/contribution-points#Sorting-of-groups)).

We can now modify the **extension.ts**. For the sake of simplicity let's just pop-up a message.


### Example 1 (Say Hello by RADON!)

```typescript

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
    vscode.window.showInformationMessage('Hello by RADON!')
    // vscode.window.showWarningMessage('ALT! This is a warning')
    // vscode.window.showErrorMessage('ERROR! Something wrong with your code?')
  }
});

  context.subscriptions.push(disposable);
}

```


### Example 2 (Print file name and content)

```typescript

import * as vscode from 'vscode';
import { readFileSync } from 'fs';

export function activate(context: vscode.ExtensionContext) {
  
  let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
  
     if (vscode.window.activeTextEditor) {
  
       const currentDocument = vscode.window.activeTextEditor.document
       const content = readFileSync(currentDocument.uri.path, 'utf-8')

       vscode.window.showInformationMessage(`Click on ${currentDocument.uri.path}`)
       vscode.window.showInformationMessage(`Content: ${content}`)
       
       // At this point you can also use the content to make a RESTful call
       // and print the reponse, instead
  });
  
  context.subscriptions.push(disposable);
}

```


## Integrate the extension in Eclipse Che

* in the ./helloworld run ```vsce package``` (see https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce). This will generate a package called *helloworld-0.0.1.vsix*
* move *helloworld-0.0.1.vsix* in the repository radon-plugin-registry/radon/examples/helloworld (commit changes)
* add the following *meta.yaml* in radon-plugin-registry/radon/examples/helloworld (commit changes)

```yaml
apiVersion: v2
publisher: radon
name: helloworld
version: 0.0.1
type: VS Code extension
displayName: RADON-h2020 Hello World
title: A Greeting by RADON
description: An example of plugin to be integrate in Che
icon: https://www.eclipse.org/che/images/logo-eclipseche.svg
repository: https://github.com/radon-h2020/radon-defect-prediction-plugin
category: Other
spec:
  extensions:
    - https://raw.githubusercontent.com/radon-h2020/radon-plugin-registry/master/radon/examples/helloworld/helloworld-0.0.1.vsix

```

* Create a workspace on Eclipse Che
* Add the following lines in the "components" list of the devfile

```yaml
components:
  - type: chePlugin
    reference: >-
      https://raw.githubusercontent.com/radon-h2020/radon-plugin-registry/master/radon/examples/helloworld/meta.yaml
```

* Open the workspace
* Create a file *test.yaml*
* Righ-click on the file window: you should be able to see the new voice "Say hello" in the context menu. Click it to activat the plugin. 
###


An implemented example of plugin can be found in this [repo](https://github.com/radon-h2020/demo-radon-plugins/tree/master/che/plugins/helloworld).

The extension package and the meta file are in the [radon-plugin-registry](https://github.com/radon-h2020/radon-plugin-registry/tree/master/radon/examples/helloworld).


## Further references

*How to integrate VSC extensions in Che*

* https://www.eclipse.org/che/docs/che-7/using-a-visual-studio-code-extension-in-che/#publishing-a-vs-code-extension-into-the-che-plug-in-registry_using-a-visual-studio-code-extension-in-che [Text]

* https://www.youtube.com/watch?v=FwiOnC8Zkqs [Video min 01:00 to 18:00]

*What else can I do beside context menu?*

* https://code.visualstudio.com/api/references/contribution-points
