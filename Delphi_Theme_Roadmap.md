# Delphi 11 Theme Roadmap

> Objetivo: replicar fielmente a aparência do Delphi 11 (CNPack) no VS Code e Kiro IDE.

---

# Fase 1 - Base do Projeto

Objetivo:
Criar toda a documentação que servirá como fonte da verdade do projeto.

## 1.1 Exportar configurações do Delphi

Status:
- [x] Registro exportado

Origem:
HKCU\Software\Embarcadero\BDS\23.0\Editor\Highlight

Resultado esperado:

reference/
    delphi-highlight.reg

---

## 1.2 Converter REG para JSON

Objetivo:

Converter o registro exportado para um JSON estruturado.

Regras:

- converter BGR → RGB
- preservar Bold
- preservar Italic
- preservar Underline
- manter exatamente os nomes das categorias
- ordenar alfabeticamente

Resultado:

reference/
    delphi-colors.json

Exemplo:

{
    "Reserved word": {
        "foreground": "#FFE0BC",
        "background": "#2D2F32",
        "bold": true,
        "italic": false,
        "underline": false
    }
}

---

## 1.3 Criar documentação das cores

Objetivo:

Gerar documentação legível para humanos.

Arquivo:

docs/color-spec.md

Conteúdo:

| Categoria Delphi | Foreground | Background | Bold | Italic | Underline |
|------------------|------------|------------|------|---------|-----------|

Observações importantes sobre cada categoria.

---

## 1.4 Mapear categorias para TextMate

Objetivo:

Definir quais scopes do VS Code representam cada categoria Delphi.

Arquivo:

reference/token-map.json

Exemplo:

{
    "Reserved word": [
        "keyword",
        "storage.type"
    ],

    "String": [
        "string"
    ],

    "Comment": [
        "comment"
    ]
}

Cada mapeamento deverá possuir comentários justificando a escolha.

---

# Fase 2 - Projeto de Testes

Objetivo:

Criar arquivos Delphi contendo praticamente todos os elementos da linguagem.

Esses arquivos NÃO representam código de produção.

Servem apenas para validação visual.

Estrutura:

samples/

    Everything.pas

    Program.dpr

    Library.dpr

    Package.dpk

    Resources.rc

---

## 2.1 Everything.pas

Objetivo:

Criar um arquivo extremamente completo contendo:

- comentários
- XML Documentation
- directives
- classes
- interfaces
- helpers
- enums
- sets
- arrays
- records
- packed records
- generics
- anonymous methods
- attributes
- properties
- constructors
- destructors
- exceptions
- operators
- strings
- chars
- floats
- hexadecimais
- binary
- octal
- ponteiros
- labels
- goto
- threadvar
- resourcestring
- etc.

Além disso:

Criar um método contendo diversos níveis de begin/end para validar Structural Highlighting.

---

# Fase 3 - Desenvolvimento do Tema

Objetivo:

Criar os temas oficiais.

Estrutura:

themes/

    delphi-dark-color-theme.json

    delphi-light-color-theme.json

A implementação deverá seguir rigorosamente:

- color-spec.md
- token-map.json

---

# Fase 4 - Refinamento

Objetivo:

Comparar continuamente:

Delphi

↓

VS Code

↓

Kiro

Corrigir diferenças visuais.

Checklist:

- palavras reservadas
- números
- strings
- comentários
- diretivas
- classes
- interfaces
- records
- properties
- methods
- structural highlighting
- símbolos
- operadores

---

# Fase 5 - Publicação

Criar:

README.md

CHANGELOG.md

LICENSE

Screenshots comparativos.

Publicar em:

- VS Code Marketplace
- Open VSX
- Kiro Marketplace (caso disponível)

---

# Objetivo Final

Entregar um tema que qualquer desenvolvedor Delphi consiga abrir no VS Code e sentir que está utilizando a IDE original.

A prioridade máxima é fidelidade visual, não criatividade.