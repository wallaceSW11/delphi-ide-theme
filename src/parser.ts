import * as vscode from 'vscode';

const TYPE_DECL_KEYWORDS = new Set(['class', 'record', 'interface']);
const HELPER_KEYWORD = 'helper';

const STACK_PUSH_KEYWORDS = new Set(['begin', 'try', 'repeat', 'asm']);
const CASE_KEYWORD = 'case';

const DEPTH_COLORED_KEYWORDS = new Set([
    ...STACK_PUSH_KEYWORDS,
    CASE_KEYWORD,
    'end', 'until',
    'if', 'then', 'else',
    'for', 'while',
    'with',
    'except', 'finally',
    'raise',
    'break', 'continue', 'exit',
    'goto',
    'on',
]);

interface TypeDeclaration {
    line: number;
    startChar: number;
    keyword: string;
    keywordLength: number;
    depth: number;
    isForward: boolean;
}

interface BlockEntry {
    kind: 'type_decl' | 'begin_end';
    depth: number;
    line: number;
    decrementsDepth: boolean;
}

interface TokenResult {
    line: number;
    startChar: number;
    length: number;
    tokenType: number;
    tokenModifiers: number;
}

function isWordChar(ch: string): boolean {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === '_';
}

function findNextWord(line: string, startPos: number): { word: string; start: number; end: number } | null {
    let pos = startPos;

    while (pos < line.length && !isWordChar(line[pos]))
        pos++;

    if (pos >= line.length)
        return null;

    const start = pos;

    while (pos < line.length && isWordChar(line[pos]))
        pos++;

    return { word: line.substring(start, pos).toLowerCase(), start, end: pos };
}

function isForwardDeclaration(line: string, keywordEnd: number): boolean {
    let parenDepth = 0;

    for (let i = keywordEnd; i < line.length; i++)
    {
        const ch = line[i];

        if (ch === '(')
        {
            parenDepth++;
            continue;
        }

        if (ch === ')')
        {
            parenDepth = Math.max(0, parenDepth - 1);
            continue;
        }

        if (parenDepth > 0)
            continue;

        if (ch === ';')
            return true;

        if (ch !== ' ')
            return false;
    }

    return false;
}

function isTypeDeclarationLine(line: string): TypeDeclaration | null {
    const equalsPos = line.indexOf('=');

    if (equalsPos < 0)
        return null;

    let pos = equalsPos + 1;
    const n = line.length;

    while (pos < n && line[pos] === ' ')
        pos++;

    const keywords: string[] = [];
    const starts: number[] = [];
    let keywordEnd = -1;

    while (pos < n)
    {
        const next = findNextWord(line, pos);

        if (!next)
            break;

        if (next.word === 'packed' || next.word === 'sealed' || next.word === 'abstract')
        {
            pos = next.end;
            continue;
        }

        if (TYPE_DECL_KEYWORDS.has(next.word))
        {
            keywords.push(next.word);
            starts.push(next.start);
            keywordEnd = next.end;
            pos = next.end;

            const after = findNextWord(line, pos);

            if (after && after.word === HELPER_KEYWORD)
            {
                keywordEnd = after.end;
                pos = after.end;
            }

            break;
        }

        break;
    }

    if (keywords.length === 0)
        return null;

    const isForward = keywordEnd >= 0 && isForwardDeclaration(line, keywordEnd);

    return {
        line: -1,
        startChar: starts[0],
        keyword: keywords[0],
        keywordLength: keywords[0].length,
        depth: -1,
        isForward,
    };
}

interface LineTokens {
    words: { word: string; start: number; length: number }[];
}

function tokenizeLine(line: string): LineTokens {
    const words: { word: string; start: number; length: number }[] = [];
    let pos = 0;

    while (pos < line.length)
    {
        const ch = line[pos];

        if (ch === "'")
        {
            pos++;
            while (pos < line.length && line[pos] !== "'")
                pos++;
            if (pos < line.length)
                pos++;
            continue;
        }

        if (ch === '/' && pos + 1 < line.length && line[pos + 1] === '/')
            break;

        if (ch === '{' || (ch === '(' && pos + 1 < line.length && line[pos + 1] === '*'))
            break;

        if (!isWordChar(ch))
        {
            pos++;
            continue;
        }

        const start = pos;

        while (pos < line.length && isWordChar(line[pos]))
            pos++;

        const word = line.substring(start, pos).toLowerCase();

        words.push({ word, start, length: pos - start });
    }

    return { words };
}

function getIndentDepth(lineText: string, indentSize: number): number {
    let spaces = 0;

    for (let i = 0; i < lineText.length; i++)
    {
        if (lineText[i] === ' ')
            spaces++;
        else if (lineText[i] === '\t')
            spaces += indentSize;
        else
            break;
    }

    return Math.floor(spaces / indentSize);
}

function depthModifier(depthLevel: number): number {
    return 1 << (depthLevel % 6);
}

export function parseSemanticTokens(document: vscode.TextDocument): TokenResult[] {
    const results: TokenResult[] = [];
    const text = document.getText();
    const lines = text.split('\n');
    const indentSize = 2;

    const blockStack: BlockEntry[] = [];
    let beginEndDepth = 0;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++)
    {
        const rawLine = lines[lineIdx];
        if (rawLine.trim() === '')
            continue;

        const depth = getIndentDepth(rawLine, indentSize);
        const stripped = rawLine.trimStart();

        if (stripped.startsWith('//') || stripped.startsWith('{') || stripped.startsWith('(*'))
            continue;

        const { words } = tokenizeLine(rawLine);
        let pendingIncrement = false;
        let seenCase = false;
        let seenFor = false;

        const typeDecl = isTypeDeclarationLine(rawLine);

        if (typeDecl && !typeDecl.isForward)
        {
            typeDecl.line = lineIdx;
            typeDecl.depth = depth;

            blockStack.push({
                kind: 'type_decl',
                depth,
                line: lineIdx,
                decrementsDepth: false,
            });

            results.push({
                line: lineIdx,
                startChar: typeDecl.startChar,
                length: typeDecl.keywordLength,
                tokenType: 1,
                tokenModifiers: 0,
            });

            continue;
        }

        for (const w of words)
        {
            if (w.word === 'end')
            {
                let handledTypeClose = false;

                while (blockStack.length > 0)
                {
                    const top = blockStack[blockStack.length - 1];

                    if (top.kind === 'type_decl' && depth === top.depth)
                    {
                        results.push({
                            line: lineIdx,
                            startChar: w.start,
                            length: w.length,
                            tokenType: 1,
                            tokenModifiers: 0,
                        });

                        blockStack.pop();
                        handledTypeClose = true;
                        break;
                    }

                    if (top.kind === 'begin_end')
                    {
                        blockStack.pop();

                        if (top.decrementsDepth)
                            beginEndDepth = Math.max(0, beginEndDepth - 1);
                        break;
                    }

                    if (top.kind === 'type_decl' && depth !== top.depth)
                        break;

                    blockStack.pop();
                }

                if (!handledTypeClose)
                {
                    results.push({
                        line: lineIdx,
                        startChar: w.start,
                        length: w.length,
                        tokenType: 0,
                        tokenModifiers: depthModifier(beginEndDepth),
                    });
                }

                continue;
            }

            if (w.word === 'except' || w.word === 'finally')
            {
                while (blockStack.length > 0)
                {
                    const top = blockStack[blockStack.length - 1];

                    if (top.kind === 'begin_end' && top.depth > depth)
                    {
                        blockStack.pop();

                        if (top.decrementsDepth)
                            beginEndDepth = Math.max(0, beginEndDepth - 1);
                        continue;
                    }

                    break;
                }

                beginEndDepth = Math.max(0, beginEndDepth - 1);

                results.push({
                    line: lineIdx,
                    startChar: w.start,
                    length: w.length,
                    tokenType: 0,
                    tokenModifiers: depthModifier(beginEndDepth),
                });

                pendingIncrement = true;

                continue;
            }

            if (w.word === 'until')
            {
                while (blockStack.length > 0)
                {
                    const top = blockStack[blockStack.length - 1];

                    if (top.kind === 'begin_end')
                    {
                        blockStack.pop();

                        if (top.decrementsDepth)
                            beginEndDepth = Math.max(0, beginEndDepth - 1);
                        break;
                    }

                    blockStack.pop();
                }

                results.push({
                    line: lineIdx,
                    startChar: w.start,
                    length: w.length,
                    tokenType: 0,
                    tokenModifiers: depthModifier(beginEndDepth),
                });

                continue;
            }

            if (w.word === 'of' && seenCase)
            {
                results.push({
                    line: lineIdx,
                    startChar: w.start,
                    length: w.length,
                    tokenType: 0,
                    tokenModifiers: depthModifier(beginEndDepth),
                });

                continue;
            }

            if ((w.word === 'to' || w.word === 'downto' || w.word === 'do') && seenFor)
            {
                results.push({
                    line: lineIdx,
                    startChar: w.start,
                    length: w.length,
                    tokenType: 0,
                    tokenModifiers: depthModifier(beginEndDepth),
                });

                continue;
            }

            if (DEPTH_COLORED_KEYWORDS.has(w.word))
            {
                if (w.word === 'case')
                    seenCase = true;

                if (w.word === 'for')
                    seenFor = true;

                if (w.word === CASE_KEYWORD)
                {
                    blockStack.push({
                        kind: 'begin_end',
                        depth,
                        line: lineIdx,
                        decrementsDepth: false,
                    });
                }
                else if (STACK_PUSH_KEYWORDS.has(w.word))
                {
                    blockStack.push({
                        kind: 'begin_end',
                        depth,
                        line: lineIdx,
                        decrementsDepth: true,
                    });

                    pendingIncrement = true;
                }

                results.push({
                    line: lineIdx,
                    startChar: w.start,
                    length: w.length,
                    tokenType: 0,
                    tokenModifiers: depthModifier(beginEndDepth),
                });
            }
        }

        if (pendingIncrement)
            beginEndDepth++;
    }

    return results;
}
