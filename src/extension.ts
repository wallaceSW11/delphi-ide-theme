import * as vscode from 'vscode';
import { PascalSemanticTokensProvider } from './semanticTokens';

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
}

export function deactivate(): void {
    // no cleanup needed
}
