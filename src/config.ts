import * as vscode from 'vscode';

export interface ThemeConfig {
    ideBackground: string;
    editorBackground: string;
    primaryColor: string;
}

export function getThemeConfig(): ThemeConfig {
    const cfg = vscode.workspace.getConfiguration('delphiTheme');

    return {
        ideBackground: cfg.get<string>('ideBackground', '#15141B'),
        editorBackground: cfg.get<string>('editorBackground', '#110F18'),
        primaryColor: cfg.get<string>('primaryColor', '#BBBBBC'),
    };
}
