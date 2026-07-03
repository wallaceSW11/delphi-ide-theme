# Delphi IDE Theme

> **Bring the authentic Delphi IDE experience to Visual Studio Code and Kiro IDE.**

An inspired recreation of the Delphi 11 Alexandria editor colors, carefully designed to capture the familiar look and feel of the original IDE — including the iconic CNPack-inspired structural highlighting.

Whether you're maintaining legacy applications or building modern Object Pascal projects, Delphi IDE Theme makes VS Code feel like home.

<p align="center">
  <img src="https://raw.githubusercontent.com/wallacesw11/delphi-ide-theme/main/docs/icon_240.png" width="240" alt="Delphi IDE Theme">
</p>

---

## ✨ Features

- 🎨 Inspired by the Delphi 11 Alexandria color palette
- 🌙 Dark theme
- ☀️ Light theme
- 🌈 CNPack-inspired 6-level structural highlighting
- 🔥 Carefully tuned Object Pascal syntax highlighting
- 🚀 Compatible with Visual Studio Code and Kiro IDE
- ❤️ Built by a Delphi developer for the Delphi community

---

## 📸 Preview

The screenshots below compare the original Delphi IDE with Delphi IDE Theme running in Visual Studio Code.

| Delphi IDE | VS Code |
|------------|----------|
| ![](https://raw.githubusercontent.com/wallacesw11/delphi-ide-theme/main/docs/images/delphi-dark.png) | ![](https://raw.githubusercontent.com/wallacesw11/delphi-ide-theme/main/docs/images/vscode-dark.png) |

| Delphi IDE (Light) | VS Code (Light) |
|--------------------|-----------------|
| ![](https://raw.githubusercontent.com/wallacesw11/delphi-ide-theme/main/docs/images/delphi-light.png) | ![](https://raw.githubusercontent.com/wallacesw11/delphi-ide-theme/main/docs/images/vscode-light.png) |

---

## 🎨 Included Themes

### Delphi IDE Dark

Designed to capture the default Delphi 11 Alexandria Dark theme.

Highlights include:

- Reserved words in warm gold
- Comments in green (italic)
- Strings in blue
- Numbers in magenta
- Classes, Records and Interfaces highlighted in red
- CNPack-inspired structural keyword coloring

### Delphi IDE Light

A light version preserving the same semantic structure while adapting colors for light backgrounds.

Highlights include:

- Reserved words in navy blue (bold)
- Comments in green (italic)
- Strings in blue
- Numbers in blue
- Classes, Records and Interfaces highlighted in dark red
- Same CNPack structural keyword coloring as the dark theme

---

## 🌈 Structural Highlighting

One of Delphi's most recognizable editor features is the structural coloring of nested blocks.

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

| Depth | Color        | Hex       |
| ----- | ------------ | --------- |
| 1     | Red          | `#FA0000` |
| 2     | Orange       | `#FF9900` |
| 3     | Green        | `#59CB33` |
| 4     | Turquoise    | `#00CED1` |
| 5     | Blue         | `#4169E1` |
| 6     | Purple       | `#9B59B6` |

After level 6, the color cycle repeats.

---

## 📦 Installation

Install directly from the Visual Studio Code Marketplace.

Search for:

```
Delphi IDE Theme
```

or install manually:

```bash
code --install-extension delphi-ide-theme-x.x.x.vsix
```

---

## 🎛️ Customization

You can personalize the Delphi IDE Dark theme appearance through VS Code settings.

Open **Settings** (`Ctrl+,`) and search for `delphiTheme`:

| Setting | Default | Description |
|---------|---------|-------------|
| `delphiTheme.ideBackground` | `#15141B` | IDE chrome background (sidebar, activity bar, status bar, menus, terminal) |
| `delphiTheme.editorBackground` | `#110F18` | Editor area and gutter background |
| `delphiTheme.primaryColor` | `#990000` | Accent color for buttons, badges, focus indicators, and active tab border |

Changes apply immediately — no reload needed.

---

## 🔧 Recommended Pascal Extensions

This theme works with any Pascal extension that provides TextMate scopes.

Recommended:

- Pascal (Alefragnani)
- OmniPascal
- Delphi LSP (when available)
- [indent-rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow) — colorizes indentation levels, complementing the structural highlighting

---

## 🛣️ Roadmap

- ✅ Delphi IDE Dark
- ✅ Delphi IDE Light
- ✅ CNPack structural highlighting
- 🔄 Improved semantic token support
- 🔄 Additional Delphi language coverage
- 🔄 Future Delphi version refinements

---

## 🤝 Contributing

Contributions, suggestions and bug reports are always welcome.

If you find any syntax highlighting that differs from the Delphi IDE, feel free to open an Issue.

---

## ⚠️ Disclaimer

This is an independent open-source project inspired by the visual appearance of the Delphi IDE.

It is **not affiliated with, endorsed by, or sponsored by Embarcadero Technologies or the CNPack project.**

All trademarks belong to their respective owners.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Wallace Ferreira**

Senior Full Stack Engineer • Product-minded Engineer • AI-Assisted Development

GitHub:

https://github.com/wallacesw11

---

## ⭐ Enjoying the project?

If this theme makes your Delphi development experience better, please consider giving the repository a **Star**.

It helps the project reach more developers and motivates future improvements.

---

## 🎯 Project Goals

This project is more than a color theme.

It is an effort to faithfully reproduce the Delphi IDE editing experience using modern editors such as Visual Studio Code and Kiro IDE, while documenting the language highlighting rules through a specification-driven development approach.

The long-term goal is to provide the Delphi community with a high-quality, well-documented and professionally maintained theme.

---

> **Making Delphi feel like home in modern editors.**
