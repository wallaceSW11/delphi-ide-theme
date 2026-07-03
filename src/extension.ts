import * as vscode from 'vscode';
import { PascalSemanticTokensProvider } from './semanticTokens';
import { getThemeConfig } from './config';

const DARK_THEME_SELECTOR = '[Delphi IDE Dark]';

function applyCustomizations(): void {
    const config = getThemeConfig();
    const workbenchConfig = vscode.workspace.getConfiguration();
    const existing = workbenchConfig.inspect<Record<string, unknown>>('workbench.colorCustomizations');

    const globalValue = (existing?.globalValue ?? {}) as Record<string, unknown>;
    const current = (globalValue[DARK_THEME_SELECTOR] ?? {}) as Record<string, string>;

    const updated = {
        ...current,
        'editor.background': config.editorBackground,
        'editorGutter.background': config.editorBackground,
        'tab.activeBackground': config.editorBackground,
        'sideBar.background': config.ideBackground,
        'activityBar.background': config.ideBackground,
        'statusBar.background': config.ideBackground,
        'statusBar.noFolderBackground': config.ideBackground,
        'titleBar.activeBackground': config.ideBackground,
        'menu.background': config.ideBackground,
        'tab.inactiveBackground': config.ideBackground,
        'terminal.background': config.ideBackground,
        'editor.foldBackground': config.ideBackground,
        'scrollbar.shadow': config.ideBackground,
        'sideBarSectionHeader.background': config.ideBackground,
        'activityBarBadge.background': config.primaryColor,
        'focusBorder': config.primaryColor,
        'button.background': config.primaryColor,
        'tab.activeBorderTop': config.primaryColor,
        'inputOption.activeBorder': config.primaryColor,
    };

    const merged = { ...globalValue, [DARK_THEME_SELECTOR]: updated };

    workbenchConfig.update(
        'workbench.colorCustomizations',
        merged,
        vscode.ConfigurationTarget.Global,
    );
}

export function activate(context: vscode.ExtensionContext): void {
    const selector: vscode.DocumentSelector = [
        { language: 'pascal' },
        { language: 'objectpascal' },
    ];

    const provider = new PascalSemanticTokensProvider();

    const legend = new vscode.SemanticTokensLegend(
        provider.tokenTypes,
        provider.tokenModifiers,
    );

    context.subscriptions.push(
        vscode.languages.registerDocumentSemanticTokensProvider(
            selector,
            provider,
            legend,
        ),
    );

    applyCustomizations();

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('delphiTheme'))
                applyCustomizations();
        }),
    );
}

export function deactivate(): void {
    // no cleanup needed
}
