const vscode = require('vscode');
const cp = require('child_process');
const path = require('path');

function runPythonTransform(scriptName, inputText, callback) {
    const scriptPath = path.join(__dirname, scriptName);
    const child = cp.spawn('python', [scriptPath]);

    let output = '';
    let error = '';

    child.stdout.on('data', (data) => {
        output += data.toString();
    });

    child.stderr.on('data', (data) => {
        error += data.toString();
    });

    child.on('close', (code) => {
        if (code !== 0 || error) {
            vscode.window.showErrorMessage(`Python error: ${error}`);
            return;
        }
        callback(output);
    });

    child.stdin.write(inputText);
    child.stdin.end();
}

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.removeExtraCommas', () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            const fullText = editor.document.getText();

            runPythonTransform('remove_commas.py', fullText, (transformed) => {
                const fullRange = new vscode.Range(
                    editor.document.positionAt(0),
                    editor.document.positionAt(fullText.length)
                );

                editor.edit((editBuilder) => {
                    editBuilder.replace(fullRange, transformed);
                });

                vscode.window.showInformationMessage('Removed trailing commas.');
            });
        }),

        vscode.commands.registerCommand('extension.flattenSelectedFunction', () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            if (!selectedText.includes('(')) {
                vscode.window.showWarningMessage('Please select a function call.');
                return;
            }

            runPythonTransform('flatten_function.py', selectedText, (transformed) => {
                editor.edit((editBuilder) => {
                    editBuilder.replace(selection, transformed.trim());
                });

                vscode.window.showInformationMessage('Function flattened.');
            });
        })
    );
}

exports.activate = activate;
