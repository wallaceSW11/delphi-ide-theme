# AGENTS.md — Delphi IDE Theme

Tema para VS Code e Kiro IDE que recria fielmente a aparencia da IDE do Delphi.

## Comandos

```bash
node scripts/convert-reg-to-json.mjs                                 # hi.reg → reference/delphi-colors.json
node scripts/convert-reg-to-json.mjs reference/delphi-highlight-light.reg reference/delphi-colors-light.json  # light theme
pnpm compile                            # tsc -p ./
pnpm watch                              # tsc -watch -p ./
pnpm test                               # vitest run
pnpm test:watch                         # vitest (watch mode)
pnpm package                            # vsce package (gera .vsix)
```

## Arquitetura

O projeto combina **tema TextMate** (cores base) com **Semantic Tokens** (type declarations, structural highlighting).

```
reference/
    delphi-highlight.reg       # export original do registro do Delphi
    delphi-colors.json         # cores convertidas (BGR→RGB), ordenadas alfabeticamente
    token-map.json            # mapeamento Delphi Category → TextMate scopes
docs/
    color-spec.md              # especificacao legivel das cores
scripts/
    convert-reg-to-json.mjs    # script de conversao REG → JSON
themes/
    delphi-dark-color-theme.json   # tema escuro (TextMate + UI + semanticTokenColors)
    delphi-light-color-theme.json  # tema claro
samples/
    Everything.pas             # arquivo de teste visual (todos os elementos)
    Program.dpr                # arquivo de teste visual (program)
    Library.dpr                # arquivo de teste visual (library)
    Package.dpk                # arquivo de teste visual (package)
    Resources.rc               # arquivo de teste visual (resources)
src/
    extension.ts               # entry point, registra SemanticTokensProvider
    semanticTokens.ts          # DocumentSemanticTokensProvider
    parser.ts                  # tokenizador linha-a-linha com stack de blocos
    parser.test.ts             # testes unitarios (vitest)
out/
    *.js                       # compilado pelo tsc
```

### TextMate (cores base)

`themes/delphi-*-color-theme.json` define `tokenColors` que mapeiam scopes TextMate para cores.
Cobre: keywords, comments, strings, numbers, identifiers, symbols, preprocessor, assembler, attributes.

### Semantic Tokens (type declarations + structural highlighting)

`src/parser.ts` analisa o codigo linha a linha com uma stack de blocos (`type_decl`, `begin_end`).
Atribui tokens semanticos `keyword` (com modifiers `depth1`-`depth6`) e `type`.

`themes/delphi-*-color-theme.json` define `semanticTokenColors` que mapeiam esses tokens para cores.

**6 cores de profundidade:** `#FA0000`, `#FF9900`, `#59CB33`, `#00CED1`, `#4169E1`, `#9B59B6` ciclando a cada 6 niveis.

### Cores

Fonte da verdade: `reference/delphi-colors.json` (convertido de `hi.reg`).

Cores BGR do Delphi (`$00BBGGRR`) sao convertidas para RGB (`#RRGGBB`).
Cores nomeadas (`clWhite`, `clRed`, etc.) sao resolvidas via tabela de constantes VCL.

### Mapeamento de escopos

`reference/token-map.json` define quais TextMate scopes cada categoria Delphi representa.

## Empacotamento

```bash
pnpm package   # vsce package --no-dependencies --allow-missing-repository
```

O `.vscodeignore` exclui `src/`, `scripts/`, `reference/`, `docs/`, `samples/`, `hi.reg`, `tsconfig.json`, `vitest.config.ts`, `*.map`, `coverage/`, lockfiles.

## Publicacao

- **Publisher**: `wallaceferreira`
- **Marketplaces alvo**: VS Code Marketplace + Kiro IDE (Open VSX Registry)
- Linguagens ativadas: `objectpascal` e `pascal`.

## Roadmap

Ver `Delphi_Theme_Roadmap.md` para o plano completo.

## Convencoes

- **pnpm** como gerenciador de pacotes. Zero npm/yarn.
- TypeScript compila com `tsc`, sem bundler.
- `rootDir` = `src`, `outDir` = `out`. Entry: `./out/extension.js`.
- Target: VS Code 1.75+ e Kiro compativel.
- Testes com **vitest**. Coverage via `@vitest/coverage-v8`.
- Arquivos em `samples/` sao para testes manuais. Nao vao no .vsix.

## Skills

- `/pipeline` — Automatiza merge request: diff, testes, code review, ajustes, commit e criacao de MR no GitHub. Consulte `@pipeline` para o workflow completo.
