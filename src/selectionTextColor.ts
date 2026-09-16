import * as vscode from 'vscode';
import { getThemeConfig } from './config';

const supportedColorThemes = new Set(['Delphi IDE Dark', 'Delphi IDE Light']);

let selectionDecoration: vscode.TextEditorDecorationType | undefined;

function activeColorThemeLabel(): string {
    return vscode.workspace.getConfiguration('workbench').get<string>('colorTheme') ?? '';
}

function isSupportedColorTheme(): boolean {
    return supportedColorThemes.has(activeColorThemeLabel());
}

function selectedRanges(editor: vscode.TextEditor): readonly vscode.Range[] {
    return editor.selections.filter(selection => !selection.isEmpty);
}

function applySelectionColor(editor: vscode.TextEditor | undefined): void {
    if (!selectionDecoration || !editor)
        return;

    const ranges = isSupportedColorTheme() ? selectedRanges(editor) : [];
    editor.setDecorations(selectionDecoration, ranges);
}

function recreateSelectionDecoration(): void {
    selectionDecoration?.dispose();

    const color = getThemeConfig().selectionTextColor;
    selectionDecoration = vscode.window.createTextEditorDecorationType({ color });

    for (const editor of vscode.window.visibleTextEditors)
        applySelectionColor(editor);
}

export function registerSelectionTextColor(context: vscode.ExtensionContext): void {
    recreateSelectionDecoration();

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(event => {
            applySelectionColor(event.textEditor);
        }),
        vscode.window.onDidChangeActiveTextEditor(editor => {
            applySelectionColor(editor);
        }),
        vscode.workspace.onDidChangeConfiguration(event => {
            if (!event.affectsConfiguration('workbench.colorTheme') && !event.affectsConfiguration('delphiTheme.selectionTextColor'))
                return;

            recreateSelectionDecoration();
        }),
        { dispose: () => selectionDecoration?.dispose() },
    );

    applySelectionColor(vscode.window.activeTextEditor);
}
