import * as vscode from 'vscode';

export function getThemeConfig() {
    const cfg = vscode.workspace.getConfiguration('delphiTheme');

    return {
        ideBackground: cfg.get<string>('ideBackground', '#15141B'),
        editorBackground: cfg.get<string>('editorBackground', '#110F18'),
        primaryColor: cfg.get<string>('primaryColor', '#990000'),
    };
}
