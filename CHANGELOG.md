# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Theme customization panel via VS Code Settings (`delphiTheme.ideBackground`, `delphiTheme.editorBackground`, `delphiTheme.primaryColor`)
- Backup of original theme colors in `reference/theme-colors-original.json`

### Changed

- Darker editor background (`#110F18`) and IDE chrome background (`#15141B`) for improved visual comfort
- Primary accent color changed from yellow (`#FFE0BC`) to deep red (`#990000`) for buttons, badges, and focus indicators
- Light theme primary color changed from teal (`#008080`) to blue (`#007ACC`)
- README branding updated from "faithful recreation" to "inspired recreation" for transparency
- README added customization documentation and light theme screenshots

## [1.0.0] - 2026-07-01

### Added

- Delphi IDE Dark theme with faithful recreation of the Delphi IDE color palette
- Delphi IDE Light theme
- CNPack-inspired 6-level structural highlighting via Semantic Tokens
- Complete Delphi syntax validation suite (`Everything.pas`)
- Dark and Light screenshots comparison (Delphi vs VS Code)
- Specification-driven documentation (color-spec.md, token-map.json)
- CI pipeline (build + test on PRs)
- Publish pipeline with auto-bump on merge to main (VS Code Marketplace + Open VSX)

[Unreleased]: https://github.com/wallacesw11/delphi-ide-theme/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/wallacesw11/delphi-ide-theme/releases/tag/v1.0.0
