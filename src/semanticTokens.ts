import * as vscode from 'vscode';
import { parseSemanticTokens } from './parser';

const TOKEN_TYPES = ['keyword', 'type'];
const TOKEN_MODIFIERS = ['depth1', 'depth2', 'depth3', 'depth4', 'depth5', 'depth6'];

export class PascalSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    public readonly tokenTypes = TOKEN_TYPES;
    public readonly tokenModifiers = TOKEN_MODIFIERS;

    provideDocumentSemanticTokens(
        document: vscode.TextDocument,
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        const tokens = parseSemanticTokens(document);

        const builder = new vscode.SemanticTokensBuilder(this.getLegend());

        for (const token of tokens)
            builder.push(token.line, token.startChar, token.length, token.tokenType, token.tokenModifiers);

        return builder.build();
    }

    private getLegend(): vscode.SemanticTokensLegend {
        return new vscode.SemanticTokensLegend(this.tokenTypes, this.tokenModifiers);
    }
}
