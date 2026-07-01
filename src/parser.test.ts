import { describe, it, expect } from 'vitest';
import { parseSemanticTokens } from './parser';

interface SimpleToken {
    line: number;
    startChar: number;
    length: number;
    tokenType: number;
    tokenModifiers: number;
}

function mockDocument(text: string): { getText: () => string } {
    return { getText: () => text };
}

function tokenTypeName(t: number): string {
    return t === 0 ? 'keyword' : 'type';
}

function depthFromModifier(mod: number): number {
    if (mod === 0) return -1;
    return Math.log2(mod);
}

function findTokens(doc: { getText: () => string }, word: string, expectedType: string, expectedDepth: number): SimpleToken[] {
    const tokens = parseSemanticTokens(doc as any);
    const text = doc.getText();
    const lines = text.split('\n');
    const results: SimpleToken[] = [];

    for (const t of tokens) {
        const line = lines[t.line];
        const w = line.substring(t.startChar, t.startChar + t.length).toLowerCase();

        if (w === word && tokenTypeName(t.tokenType) === expectedType && depthFromModifier(t.tokenModifiers) === expectedDepth)
            results.push(t);
    }

    return results;
}

function countTokens(doc: { getText: () => string }, word: string, expectedType: string, expectedDepth: number): number {
    return findTokens(doc, word, expectedType, expectedDepth).length;
}

describe('parseSemanticTokens', () => {
    describe('type declarations', () => {
        it('Should mark class as type when declared with body', () => {
            const doc = mockDocument('type\n  TFoo = class\n  end;');

            expect(countTokens(doc, 'class', 'type', -1)).toBe(1);
            expect(countTokens(doc, 'end', 'type', -1)).toBe(1);
        });

        it('Should mark class with parent as type', () => {
            const doc = mockDocument('type\n  TFoo = class(TBar)\n  end;');

            expect(countTokens(doc, 'class', 'type', -1)).toBe(1);
            expect(countTokens(doc, 'end', 'type', -1)).toBe(1);
        });

        it('Should mark record as type', () => {
            const doc = mockDocument('type\n  TRec = record\n    X: Integer;\n  end;');

            expect(countTokens(doc, 'record', 'type', -1)).toBe(1);
            expect(countTokens(doc, 'end', 'type', -1)).toBe(1);
        });

        it('Should mark interface as type', () => {
            const doc = mockDocument('type\n  IFoo = interface\n  end;');

            expect(countTokens(doc, 'interface', 'type', -1)).toBe(1);
            expect(countTokens(doc, 'end', 'type', -1)).toBe(1);
        });

        it('Should mark packed record as type', () => {
            const doc = mockDocument('type\n  TRec = packed record\n    X: Integer;\n  end;');

            expect(countTokens(doc, 'record', 'type', -1)).toBe(1);
        });

        it('Should NOT mark forward declaration class as type', () => {
            const doc = mockDocument('type\n  TFoo = class;');

            expect(countTokens(doc, 'class', 'type', -1)).toBe(0);
        });

        it('Should NOT mark forward declaration with parent as type', () => {
            const doc = mockDocument('type\n  TFoo = class(TBar);');

            expect(countTokens(doc, 'class', 'type', -1)).toBe(0);
        });

        it('Should NOT mark class function as type', () => {
            const doc = mockDocument('type\n  TFoo = class\n    class function Create: TFoo;\n  end;');

            expect(countTokens(doc, 'class', 'type', -1)).toBe(1);
        });
    });

    describe('structural highlighting depth', () => {
        it('Should color first begin/end pair at depth 0', () => {
            const doc = mockDocument('procedure Foo;\nbegin\nend;');

            expect(countTokens(doc, 'begin', 'keyword', 0)).toBe(1);
            expect(countTokens(doc, 'end', 'keyword', 0)).toBe(1);
        });

        it('Should increment depth for nested begin/end', () => {
            const doc = mockDocument('procedure Foo;\nbegin\n  begin\n  end;\nend;');

            expect(countTokens(doc, 'begin', 'keyword', 0)).toBe(1);
            expect(countTokens(doc, 'begin', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'end', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'end', 'keyword', 0)).toBe(1);
        });

        it('Should color if at same depth as enclosing begin', () => {
            const doc = mockDocument('procedure Foo;\nbegin\n  if X then\nend;');

            expect(countTokens(doc, 'if', 'keyword', 1)).toBe(1);
        });

        it('Should color for/to/do at same depth', () => {
            const doc = mockDocument('procedure Foo;\nbegin\n  for I := 1 to 10 do\nend;');

            expect(countTokens(doc, 'for', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'to', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'do', 'keyword', 1)).toBe(1);
        });

        it('Should color case/of at same depth', () => {
            const doc = mockDocument('procedure Foo;\nbegin\n  case X of\n    0: ;\n  end;\nend;');

            expect(countTokens(doc, 'case', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'of', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'end', 'keyword', 1)).toBe(1);
        });

        it('Should cycle depth colors past 6 levels', () => {
            const doc = mockDocument(
                'begin\n' +         // 0
                '  begin\n' +       // 1
                '    begin\n' +     // 2
                '      begin\n' +   // 3
                '        begin\n' + // 4
                '          begin\n' +// 5
                '            begin\n' +// 6 → 0
                '            end;\n' +
                '          end;\n' +
                '        end;\n' +
                '      end;\n' +
                '    end;\n' +
                '  end;\n' +
                'end;',
            );

            expect(countTokens(doc, 'begin', 'keyword', 0)).toBe(2);
            expect(countTokens(doc, 'begin', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'begin', 'keyword', 2)).toBe(1);
            expect(countTokens(doc, 'begin', 'keyword', 3)).toBe(1);
            expect(countTokens(doc, 'begin', 'keyword', 4)).toBe(1);
            expect(countTokens(doc, 'begin', 'keyword', 5)).toBe(1);
        });
    });

    describe('try/except/finally', () => {
        it('Should color except at same depth as try', () => {
            const doc = mockDocument('procedure Foo;\nbegin\n  try\n  except\n  end;\nend;');

            expect(countTokens(doc, 'try', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'except', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'end', 'keyword', 1)).toBe(1);
        });

        it('Should color finally at same depth as try', () => {
            const doc = mockDocument('procedure Foo;\nbegin\n  try\n  finally\n  end;\nend;');

            expect(countTokens(doc, 'try', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'finally', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'end', 'keyword', 1)).toBe(1);
        });

        it('Should handle nested try/except/finally', () => {
            const doc = mockDocument(
                'procedure Foo;\n' +
                'begin\n' +
                '  try\n' +
                '    try\n' +
                '    except\n' +
                '    end;\n' +
                '  finally\n' +
                '  end;\n' +
                'end;',
            );

            expect(countTokens(doc, 'try', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'try', 'keyword', 2)).toBe(1);
            expect(countTokens(doc, 'except', 'keyword', 2)).toBe(1);
            expect(countTokens(doc, 'finally', 'keyword', 1)).toBe(1);
        });
    });

    describe('type declaration with method bodies', () => {
        it('Should close type end as type token, method end as keyword', () => {
            const doc = mockDocument(
                'type\n' +
                '  TFoo = class\n' +
                '    procedure Bar;\n' +
                '    begin\n' +
                '    end;\n' +
                '  end;',
            );

            expect(countTokens(doc, 'class', 'type', -1)).toBe(1);
            expect(countTokens(doc, 'begin', 'keyword', 0)).toBe(1);
            expect(countTokens(doc, 'end', 'keyword', 0)).toBe(1);
            expect(countTokens(doc, 'end', 'type', -1)).toBe(1);
        });
    });

    describe('of context sensitivity', () => {
        it('Should depth-color of only after case', () => {
            const doc = mockDocument(
                'procedure Foo;\n' +
                'begin\n' +
                '  case X of\n' +
                '  end;\n' +
                'end;\n' +
                'type\n' +
                '  TSet = set of Byte;',
            );

            expect(countTokens(doc, 'of', 'keyword', 1)).toBe(1);
        });
    });

    describe('to context sensitivity', () => {
        it('Should depth-color to only after for', () => {
            const doc = mockDocument(
                'procedure Foo;\n' +
                'begin\n' +
                '  for I := 1 to 10 do\n' +
                'end;',
            );

            expect(countTokens(doc, 'to', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'do', 'keyword', 1)).toBe(1);
        });
    });

    describe('string skipping', () => {
        it('Should not tokenize keywords inside strings', () => {
            const doc = mockDocument("procedure Foo;\nbegin\n  S := 'begin end class';\nend;");

            expect(countTokens(doc, 'begin', 'keyword', 0)).toBe(1);
            expect(countTokens(doc, 'end', 'keyword', 0)).toBe(1);
        });
    });

    describe('comment skipping', () => {
        it('Should not tokenize keywords inside line comments', () => {
            const doc = mockDocument('procedure Foo;\nbegin\n  // begin end class\nend;');

            expect(countTokens(doc, 'begin', 'keyword', 0)).toBe(1);
            expect(countTokens(doc, 'end', 'keyword', 0)).toBe(1);
        });

        it('Should not tokenize keywords inside block comments', () => {
            const doc = mockDocument('procedure Foo;\nbegin\n  { begin end class }\nend;');

            expect(countTokens(doc, 'begin', 'keyword', 0)).toBe(1);
        });
    });

    describe('repeat/until', () => {
        it('Should color repeat and until at same depth', () => {
            const doc = mockDocument('procedure Foo;\nbegin\n  repeat\n    I := I + 1;\n  until I > 10;\nend;');

            expect(countTokens(doc, 'repeat', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'until', 'keyword', 1)).toBe(1);
        });
    });

    describe('asm block', () => {
        it('Should color asm and its end at same depth', () => {
            const doc = mockDocument('procedure Foo;\nbegin\n  asm\n    nop\n  end;\nend;');

            expect(countTokens(doc, 'asm', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'end', 'keyword', 1)).toBe(1);
        });
    });

    describe('flow control keywords', () => {
        it('Should color raise, break, continue, exit at current depth', () => {
            const doc = mockDocument(
                'procedure Foo;\n' +
                'begin\n' +
                '  if X then\n' +
                '    raise Exception;\n' +
                '  for I := 1 to 10 do\n' +
                '    if I = 5 then\n' +
                '      break;\n' +
                'end;',
            );

            expect(countTokens(doc, 'raise', 'keyword', 1)).toBe(1);
            expect(countTokens(doc, 'break', 'keyword', 1)).toBe(1);
        });
    });
});
