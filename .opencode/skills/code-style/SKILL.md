---
name: code-style
description: >-
  Use em TODA implementação neste projeto. Define regras de estilo para
  TypeScript em extensões VS Code: async/await, tipagem estrita, zero
  comentários, nomes auto-documentados, estrutura de módulos, proibições.
---

# Code Style — Delphi 11 Themes (VS Code Extension)

## Tipo de módulo

Projeto usa **CommonJS** (`module: "commonjs"`). Import sempre com `import ... from ...`.
Zero `require()`. Zero `export default` — usar named exports.

## Proibido

- `.then().catch()` — `async/await` sempre
- `var` — `const`/`let` apenas
- `any` desnecessário — tipar tudo (tsconfig tem `"strict": true`)
- `console.log` — usar `vscode.window.showInformationMessage`/`showWarningMessage`/`showErrorMessage` ou OutputChannel
- Hardcodar cores — usar `config.ts` (valores de `delphi11Themes.colors.*`)
- Hardcodar valores de configuração — sempre via `getConfig()`
- `!` non-null assertion — usar guard clause ou optional chaining
- `==` — sempre `===`

## Blocos de controle (if, else, for, while)

**Ordem de preferência:**
1. **Ternário** — sempre que houver exatamente 2 caminhos de valor/ação.
2. **Sem chaves** — if, else, for, while com **uma única statement** no corpo.
3. **Allman com chaves** — apenas quando o corpo tem **2+ statements** (chave na linha seguinte).

```ts
// certo: ternário (2 caminhos)
const modifier = (lower === 'class' || isForward) ? category : 'recordDecl';
existing ? existing.push(range) : fixedRanges.set(mod, [range]);

// certo: uma statement, sem chaves
if (!editor) return;
if (shouldAdvancePrevWord(lower, prevWord)) prevWord = lower;
for (const dt of depthDecorations) dt.dispose();
while (pos < line.length && isDigit(line[pos])) pos++;

// errado: uma statement com chaves
if (!editor) { return; }
for (const dt of depthDecorations) { dt.dispose(); }

// certo: 2+ statements, Allman com chaves
if (mod.startsWith('depth'))
{
  const depthIndex = Number(mod.slice(5));
  if (depthIndex >= 0 && depthIndex < depthRanges.length)
    depthRanges[depthIndex].push(range);
  continue;
}

// errado: K&R (chave na mesma linha)
if (mod.startsWith('depth')) {
  const depthIndex = Number(mod.slice(5));
  continue;
}
```

**NUNCA usar ternário aninhado.** Se precisa de 3+ caminhos, use if/else ou Record mapeado.

## Espaçamento

**Linha em branco antes** de `if`, `for`, `while`, `continue`, `return`.
A linha anterior ao bloco de controle deve estar vazia, exceto quando já é a abertura do bloco (`{`).

```ts
// certo
function skipString(line: string, start: number): number {
  let pos = start + 1;

  while (pos < line.length)
  {
    if (line[pos] !== "'")
    {
      pos++;
      continue;
    }

    if (pos + 1 < line.length && line[pos + 1] === "'")
    {
      pos += 2;
      continue;
    }

    return pos + 1;
  }

  return pos;
}

// errado: tudo grudado
function skipString(line: string, start: number): number {
  let pos = start + 1;
  while (pos < line.length)
  {
    if (line[pos] !== "'")
    {
      pos++;
      continue;
    }
    if (pos + 1 < line.length && line[pos + 1] === "'")
    {
      pos += 2;
      continue;
    }
    return pos + 1;
  }
  return pos;
}
```

## Strings mágicas — usar constantes

Zero strings literais para valores que se repetem. Extrair para constantes exportadas no módulo de domínio (ex: `tokenTypes.ts`).

```ts
// certo: constantes exportadas
export const TOKEN_KEYWORD = 'keyword';
export const TOKEN_COMMENT = 'comment';
export const COMMENT_KIND_BRACE = 'brace';
export const MODIFIER_DEPTH_PREFIX = 'depth';

// errado: string literal repetida
if (openBlockComment === 'brace') ...
tokens.push({ tokenType: 'keyword' }) ...
if (mod.startsWith('depth')) ...
```

Prefira constantes `const` sobre enums TypeScript (menos verboso, mesma segurança).

## Zero comentários

Nomes auto-documentados. Nenhum comentário no código — nem `//`, nem `/* */`.
Se precisou comentar, o nome está ruim. Renomeie.

Exceção única: comentários de licença no topo de arquivo (se exigido).

## Async

```ts
async function loadData(): Promise<void> {
  try {
    const data = await service.fetchAll();
    processData(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    vscode.window.showErrorMessage(`Failed to load: ${message}`);
  }
}
```

## VS Code Extension Patterns

### Decoration Types

```ts
const decoration = vscode.window.createTextEditorDecorationType({
  color: cfg.someColor,
});

// Sempre dar dispose
decoration.dispose();
```

### Configurações

```ts
import * as vscode from 'vscode';

export interface MyConfig {
  enabled: boolean;
  someValue: string;
}

export function getMyConfig(): MyConfig {
  const cfg = vscode.workspace.getConfiguration('delphi11Themes');
  return {
    enabled: cfg.get('enabled', true),
    someValue: cfg.get('someValue', 'default'),
  };
}
```

### Subscriptions

Sempre registrar disposables no context:

```ts
context.subscriptions.push(
  vscode.window.onDidChangeActiveTextEditor(() => update()),
  vscode.workspace.onDidChangeTextDocument(() => scheduleUpdate()),
  vscode.workspace.onDidChangeConfiguration(() => refresh()),
);
```

## Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Arquivos TypeScript | camelCase | `highlighter.ts`, `tokenTypes.ts` |
| Interfaces | PascalCase | `ParsedToken`, `DelphiThemeConfig` |
| Funções exportadas | camelCase | `parseDocument`, `getConfig` |
| Funções internas | camelCase | `skipString`, `getIndentLevel` |
| Constantes (module-level) | camelCase | `depthDecorations` |
| Variáveis locais | camelCase | `lineIdx`, `startChar` |
| Enums/Unions | PascalCase | `KeywordCategory` |

## Estrutura de módulo

- `extension.ts`: entry point. Máximo 15 linhas. Apenas `activate`/`deactivate`.
- Módulos de domínio: uma responsabilidade por arquivo. Nada de "utils gigante".
- Tipos e interfaces no mesmo arquivo que os usa, ou em `types.ts` se compartilhados.
- NUNCA pular camadas. Ex: parser não acessa config diretamente — recebe parâmetros.

## Empacotamento

```bash
pnpm compile       # compila, verifica erros
pnpm test          # roda vitest (exit code 0 mesmo sem testes)
pnpm test:watch    # vitest em modo watch
pnpm test:coverage # vitest com relatório de cobertura
pnpm package       # gera .vsix
```

NUNCA alterar `--no-dependencies` e `--allow-missing-repository` no script de package.

Gerenciador de pacotes: **pnpm**. Zero npm/yarn.

## Testes

Framework: **vitest** com `@vitest/coverage-v8`. Alvo: **100% coverage** (lines, branches, functions, statements).

### O que testar

Apenas **regras de negócio** e funções puras. Não testar framework (VS Code API, Decoration API).
Arquivos que dependem exclusivamente de `vscode.*` devem ser excluídos do coverage via `vitest.config.ts`.

### Nomenclatura

```
Should [action] when [condition]
Not should [action] when [condition]
```

### Estrutura

- `describe` agrupa por **função/método** sob teste.
- `it.each` quando há **3+ casos** para o mesmo cenário (usa objetos nomeados, não arrays posicionais).
- `it` individual para casos com **1-2 variações** ou lógica distinta.

```ts
describe('getKeywordCategory', () => {
  describe('depthColored keywords', () => {
    it.each([
      { keyword: 'begin' },
      { keyword: 'end' },
      { keyword: 'if' },
    ])('Should return depthColored when keyword is $keyword', ({ keyword }) => {
      expect(getKeywordCategory(keyword)).toBe('depthColored');
    });
  });

  describe('non-keywords', () => {
    it('Should return undefined when word is not a keyword', () => {
      expect(getKeywordCategory('xyz')).toBeUndefined();
    });
  });
});
```

### Configuração

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/extension.ts', 'src/highlighter.ts', 'src/config.ts', 'src/**/*.test.ts'],
      thresholds: { lines: 100, branches: 100, functions: 100, statements: 100 },
    },
  },
});
```
