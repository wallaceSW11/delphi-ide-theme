# Delphi IDE Theme

> **Bring the authentic Delphi IDE experience to Visual Studio Code.**

A pixel-faithful recreation of the Delphi IDE editor, including the classic CNPack-inspired structural highlighting.

Designed for developers who love Delphi and want the same familiar coding experience in Visual Studio Code and Kiro IDE.

![Delphi IDE Theme](https://raw.githubusercontent.com/wallacesw11/delphi-ide-theme/main/logo.png)

---

## ✨ Features

- 🎨 Faithful recreation of the Delphi IDE color palette
- 🌙 Dark and Light themes
- 🌈 CNPack-inspired 6-level structural highlighting
- 🔥 Carefully tuned syntax highlighting for Delphi / Object Pascal
- 📖 Specification-driven development (SDD)
- 🧪 Complete Delphi syntax validation suite
- 🚀 Compatible with VS Code and Kiro IDE
- ❤️ Built by a Delphi developer for the Delphi community

---

# 📸 Preview

> The screenshots below compare the original Delphi IDE with this theme running in Visual Studio Code.

| Delphi IDE | VS Code |
|------------|----------|
| ![](https://raw.githubusercontent.com/wallacesw11/delphi-ide-theme/main/docs/images/delphi-dark.png) | ![](https://raw.githubusercontent.com/wallacesw11/delphi-ide-theme/main/docs/images/vscode-dark.png) |

| Delphi IDE (Light) | VS Code (Light) |
|--------------------|-----------------|
| ![](https://raw.githubusercontent.com/wallacesw11/delphi-ide-theme/main/docs/images/delphi-light.png) | ![](https://raw.githubusercontent.com/wallacesw11/delphi-ide-theme/main/docs/images/vscode-light.png) |

---

# 🎨 Included Themes

## Delphi IDE Dark

Faithfully reproduces the default Delphi IDE dark appearance.

Highlights include:

- Reserved words in warm gold (bold)
- Comments in green (italic)
- Strings in blue
- Numbers in magenta
- Type declarations (`class`, `record`, `interface`) highlighted in red
- Matching `end` keywords colored according to Delphi's structural highlighting

---

## Delphi IDE Light

A faithful light version preserving the same semantic structure while adapting colors for light backgrounds.

---

# 🌈 Structural Highlighting

One of Delphi's most iconic editor features.

Block keywords change color depending on the current nesting level.

Supported keywords include:

- `begin`
- `end`
- `if`
- `then`
- `else`
- `case`
- `for`
- `while`
- `repeat`
- `until`
- `try`
- `except`
- `finally`
- `raise`
- `break`
- `continue`
- `exit`

| Depth | Color | Hex |
|--------|-------|---------|
| 1 | 🔴 Red | `#FA0000` |
| 2 | 🟠 Orange | `#FF9900` |
| 3 | 🟢 Green | `#59CB33` |
| 4 | 🔵 Turquoise | `#00CED1` |
| 5 | 🔷 Blue | `#4169E1` |
| 6 | 🟣 Purple | `#9B59B6` |

After level 6 the cycle starts again.

---

# 🧪 Testing

This project includes a complete Delphi syntax validation suite.

The sample project exercises nearly every Object Pascal language construct, allowing visual verification of:

- Keywords
- Types
- Classes
- Interfaces
- Records
- Generics
- Anonymous Methods
- Operators
- Properties
- XML Documentation
- Compiler Directives
- Numbers
- Strings
- Characters
- Comments
- Structural Highlighting
- and much more...

The goal is simple:

> Every Delphi token should look as close as possible to the original IDE.

---

# 📚 Documentation

The project is built using a specification-driven approach.

Documentation includes:

- Delphi color specification
- Delphi → TextMate scope mapping
- Structural highlighting specification
- Testing guidelines
- Development roadmap

---

# ⚙️ Recommended Pascal Extensions

This theme works with any Pascal extension that provides TextMate scopes.

Recommended extensions:

- Pascal (Alefragnani)
- OmniPascal
- Delphi LSP (when available)

---

# 📦 Installation

## Marketplace

Open the Extensions panel and search for:

```
Delphi IDE Theme
```

---

## Manual Installation

```bash
code --install-extension delphi-ide-theme-x.x.x.vsix
```

---

# 🛣️ Roadmap

- ✅ Delphi IDE Dark
- ✅ Delphi IDE Light
- ✅ Delphi syntax validation suite
- 🔄 Improve semantic token coverage
- 🔄 Additional language edge cases
- 🔄 Future Delphi version refinements

---

# 🤝 Contributing

Contributions, bug reports and suggestions are always welcome.

If you notice a syntax highlighting difference between Delphi and VS Code, feel free to open an Issue.

---

# ⚠️ Disclaimer

This is an independent open-source project inspired by the visual appearance of the Delphi IDE editor.

It is **not affiliated with, endorsed by, or sponsored by Embarcadero Technologies or the CNPack project**.

All trademarks belong to their respective owners.

---

# 📄 License

MIT License

---

# 👨‍💻 Author

**Wallace Ferreira**

Senior Full Stack Engineer • Product-minded Engineer • AI-Assisted Development

GitHub

https://github.com/wallacesw11

---

## ⭐ If this project helped you...

Please consider giving it a **Star** on GitHub.

It helps the project reach more Delphi developers and encourages future improvements.

## 🎯 Project Goals

This project is more than a color theme.

It is an effort to faithfully reproduce the Delphi IDE editing experience using modern editors such as Visual Studio Code and Kiro IDE, while documenting the language highlighting rules through a specification-driven development approach.

The long-term goal is to provide the Delphi community with a high-quality, well-documented and professionally maintained theme.