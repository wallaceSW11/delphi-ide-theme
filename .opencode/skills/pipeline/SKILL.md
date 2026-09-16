---
name: pipeline
description: Pipeline completa de entrega: diff com a main, análise e criação de testes unitários (vitest), code review (@code-style), correções, commit, push e criação de merge request no GitHub. Use quando o usuário digitar /pipeline, /pipe ou pedir pipeline, fechar a branch, criar MR ou PR.
---

# Skill: pipeline (`/pipeline`)

Fluxo completo de entrega: diff → testes → code review → commit → MR.

## Comportamento

- Comunicação com o usuário em português, direta, sem enrolação, sem emojis.
- **Commits, título e corpo do MR em inglês** — padrão do repositório.
- **Fluxo automático** — não pergunte nada ao usuário (nem mensagem de commit, nem confirmação), exceto quando houver dúvida real.
- **Overrides durante esta skill** — as proibições do agente principal sobre `git add/commit/push` e sobre criar/rodar testes ficam SUSPENSAS dentro do `/pipeline` (autorizado pelo usuário). Ainda assim:
  - Commit é permitido **somente na etapa 6** e somente para os arquivos que esta skill criou/ajustou.
  - NUNCA `git rebase`, `git merge`, `git pull`, force-push ou `git commit --amend`.
  - NUNCA alterar `package.json`, `package-lock.json` ou `.vscodeignore` sem confirmação explícita — se um ajuste exigir, PARAR e perguntar.
  - NUNCA alterar `git config`.
- Dúvida real (escopo ambíguo, arquivos sujos fora do escopo, ajuste que exige package.json): **parar e perguntar**.

## Workflow

### 0. Preparação

```bash
gh auth status            # capturar a conta com "Active account: true" para restaurar no final
gh auth switch --user wallaceSW11
git config user.name      # deve ser wallacesw11 — se não for, PARAR e perguntar
git status --short
```

A conta marcada com `Active account: true` na saída do `gh auth status` é a que será restaurada na etapa 9.

Se `git status` mostrar arquivos modificados que esta skill não criou (mudanças do usuário ainda não commitadas), PARAR e perguntar o que fazer com eles.

### 1. Diff contra a main

```bash
git fetch origin main
git log main..HEAD --oneline --no-decorate
git diff main..HEAD --stat
git diff main..HEAD -- '*.ts' '*.json' '*.md' | head -500
```

Avaliar: arquivos novos/modificados em `src/*.ts`, `themes/*.json`, `vitest.config.ts`.

### 2. Análise de testes

- **Arquivo `src/*.ts` criado ou modificado com regra de negócio pura** → precisa de teste em `src/*.test.ts` (padrão existente: `parser.test.ts`). Se faltar cobertura, criar/atualizar.
- **Arquivo que só embrulha `vscode.*`** (ex.: `extension.ts`, `semanticTokens.ts`, `config.ts`, `selectionTextColor.ts`) → não testar (framework). Se o arquivo for NOVO, adicioná-lo ao `exclude` do coverage em `vitest.config.ts` para manter os thresholds de 100%.
- Testes seguem o padrão do `@code-style`: vitest, nomes `Should ... when ...`, `describe` por função, `it.each` para 3+ casos.

### 3. Code review

Carregar a skill `@code-style` e revisar TODOS os arquivos do diff:
- Code style (async/await, tipagem estrita, zero comentários, nomes auto-documentados, blocos sem chaves/Allman, strings mágicas em constantes, cores via config.ts)
- SOLID, clean code, YAGNI — nada além do pedido
- Proibições: sem `any`, sem `.then()`, sem `console.log`, sem `!` non-null assertion, sem `==`

Violação encontrada:
- Sem dúvida → corrigir imediatamente.
- Com dúvida → parar e perguntar.

### 4. Criar/ajustar testes

Escrever os testes diretamente (não usar subagent), seguindo `parser.test.ts` e o padrão do `@code-style`. Depois:

```bash
pnpm test
```

Se falhar, corrigir e repetir até passar.

### 5. Verificação final

```bash
pnpm compile          # deve passar sem erros
git status --short
git diff --stat
```

Se `themes/*.json` foi alterado, validar o JSON:

```bash
node -e "JSON.parse(require('fs').readFileSync('themes/delphi-dark-color-theme.json','utf8'))"
node -e "JSON.parse(require('fs').readFileSync('themes/delphi-light-color-theme.json','utf8'))"
```

### 6. Commit — ÚNICO ponto onde commit é permitido

Apenas os arquivos criados/ajustados por esta skill (testes, correções de code style, `vitest.config.ts`). Stage com caminhos explícitos — nunca `git add -A`:

```bash
git add <arquivos da skill>
git commit -m "type(scope): description em inglês"
```

Mensagem: analisar `git diff --cached --stat` + `git diff --cached` e gerar `type(scope): description` em inglês (types: feat, fix, refactor, style, test, chore).

### 7. Push e MR

```bash
git push origin HEAD
```

Branch atual: `git rev-parse --abbrev-ref HEAD`. Título do MR = mensagem do commit.

Corpo do MR (em inglês):

```markdown
## What changed

### `{main files}`
{concise description of the changes}

### Tests
{list new/updated tests if any}

## How to test
pnpm test
pnpm compile
```

```bash
gh pr create --base main --head <branch> --title "type(scope): description" --body-file <arquivo-temporário>
```

### 8. Resultado

Responder com a URL do MR retornada pelo `gh pr create`.

### 9. Restaurar conta do gh

Sempre executar no final — mesmo se alguma etapa anterior falhar:

```bash
gh auth switch --user <conta capturada no passo 0>
```
