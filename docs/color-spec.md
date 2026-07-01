# Delphi 11 Color Specification

> Source: Delphi IDE editor highlight registry export
>
> Editor background: `#2D2F32` (dark theme)
>
> Editor foreground (Plain text): `#FAFEFF`

## Language Elements

| Delphi Category | Foreground | Background | Bold | Italic | Underline |
|---|---|---|---|---|---|
| Assembler | `#F0E3D0` | `#2D2F32` | false | false | false |
| Attribute Names | `#FFFFFF` | `#2D2F32` | false | false | false |
| Attribute Values | `#FFFFFF` | `#2D2F32` | false | false | false |
| Binary | `#FF7FAA` | `#2D2F32` | false | false | false |
| Character | `#FF7FAA` | `#2D2F32` | false | false | false |
| Comment | `#BCE784` | `#2D2F32` | false | **true** | false |
| Float | `#FF7FAA` | `#2D2F32` | false | false | false |
| Hex | `#FF7FAA` | `#2D2F32` | false | false | false |
| Hot Link | `#2A7FFF` | `#2D2F32` | false | false | **true** |
| Identifier | `#FFF9F0` | `#2D2F32` | false | false | false |
| Illegal Char | `#FF0000` | `#2D2F32` | false | false | false |
| Number | `#FF7FAA` | `#2D2F32` | false | false | false |
| Octal | `#FF7FAA` | `#2D2F32` | false | false | false |
| Plain text | `#FAFEFF` | `#2D2F32` | false | false | false |
| Preprocessor | `#66CDFF` | `#2D2F32` | false | false | false |
| Reserved word | `#FFE0BC` | `#2D2F32` | **true** | false | false |
| Scripts | `#FF0000` | `#2D2F32` | false | false | false |
| String | `#7FAAFF` | `#2D2F32` | false | false | false |
| Symbol | `#FFF9F0` | `#2D2F32` | false | false | false |
| Tags | `#FFE0BC` | `#2D2F32` | **true** | false | false |
| Whitespace | `#FAFEFF` | `#2D2F32` | false | false | false |

### Observations

- **Reserved word** and **Tags** share the same colors and bold weight.
- **Binary**, **Character**, **Float**, **Hex**, **Number**, and **Octal** all use `#FF7FAA` foreground — Delphi uses a unified numeric/char color.
- **Identifier** and **Symbol** share `#FFF9F0` — same color for all identifiers and operators.
- **Comment** is the only element with italic enabled.
- **Hot Link** is the only element with underline enabled.
- **Preprocessor** (`#66CDFF`) is distinct from both keywords and identifiers — directives have their own color.
- **Assembler** (`#F0E3D0`) is a desaturated yellow, distinct from identifiers.
- **Attribute Names** and **Attribute Values** both use pure white `#FFFFFF`.

## IDE-Only Elements (not applicable to VS Code themes)

| Delphi Category | Foreground | Background | Bold | Italic | Underline |
|---|---|---|---|---|---|
| Additional search match highlight | `#FAFEFF` | `#354B77` | false | false | false |
| Brace Highlight | `#C0C0C0` | `#4040C0` | false | false | false |
| Disabled break | `#EEE2CC` | `#5A5A5A` | false | false | false |
| Enabled break | `#000000` | `#7373FD` | false | false | false |
| Error line | `#FFFFFF` | `#CB4C32` | false | false | false |
| Execution point | `#000000` | `#B18A50` | false | false | false |
| Invalid break | `#EEE2CC` | `#5A5A5A` | false | false | false |
| Line Highlight | `#000000` | `#09151C` | false | false | false |
| Line Number | `#FAFEFF` | `#2D2F32` | false | false | false |
| Marked block | `#000000` | `#7FAAFF` | false | false | false |
| Modified line | `#00FF00` | `#FFFF00` | false | false | false |
| Right margin | `#C0C0C0` | `#09151C` | false | false | false |
| Search match | `#000000` | `#7FAAFF` | false | false | false |
| Sync edit background | `#000000` | `#353B47` | false | false | false |
| Sync edit highlight | `#354B77` | `#FFFFFF` | false | false | false |

These categories control Delphi IDE features (debugger breakpoints, search highlights, sync edits, margin indicators). They have **no direct equivalent** in VS Code TextMate themes and are documented here only for reference completeness.

## Diff Elements

| Delphi Category | Foreground | Background | Bold | Italic | Underline |
|---|---|---|---|---|---|
| Diff addition | `#000080` | `#FFFF00` | false | false | false |
| Diff deletion | `#000080` | `#FF0000` | false | false | false |
| Diff move | `#000080` | `#0000FF` | false | false | false |

VS Code handles diff colors through `diffEditor.*` settings in `colors`, not TextMate scopes. These values may inform the `colors` section of the theme JSON.

## Code Folding

| Delphi Category | Foreground | Background | Bold | Italic | Underline |
|---|---|---|---|---|---|
| Code folding tree | `#FAFEFF` | `#2D2F32` | false | false | false |
| Folded code | `#FAFEFF` | `#2D2F32` | false | false | false |

VS Code uses `editorFoldBackground` and related `colors` settings, not TextMate scopes.

## Structural Highlighting

The Delphi IDE applies alternating colors based on nesting depth (begin/end blocks). The configuration defines 4 depth colors:

| Depth | Color |
|---|---|
| 1 | `#868686` |
| 2 | `#3D78B2` |
| 3 | `#4D9F7D` |
| 4 | `#8A529F` |

Settings:
- **Enabled**: true
- **FlowControlEnabled**: true (colors `break`, `continue`, `exit`, etc.)
- **FlowControlLocation**: 1
- **ShowSingleLine**: true

In VS Code, structural highlighting cannot be implemented via TextMate scopes alone. It requires Semantic Tokens or the Decoration API. The theme JSON should set `semanticHighlighting: true` to enable this feature in a future implementation phase.
