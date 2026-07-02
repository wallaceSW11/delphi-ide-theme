# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Delphi IDE Light theme with authentic colors extracted from Delphi IDE registry export
- Light theme structural highlighting with 4-level depth cycle (`#868686`, `#3D78B2`, `#4D9F7D`, `#8A529F`)
- Production-ready pipeline skill (`/pipeline`) for automated merge request workflow
- CLI argument support in `convert-reg-to-json.mjs` for processing UTF-16 LE registry exports

### Changed

- Light theme label updated from "em desenvolvimento" to production status
- README updated to reflect light theme availability

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
