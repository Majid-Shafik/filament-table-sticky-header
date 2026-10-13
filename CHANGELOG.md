# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- Fix the sticky header being misplaced after Livewire morphs the table (e.g. when sorting a column).
- Fix DOM changes going unnoticed after `wire:navigate` replaced the `<body>`.

## 1.0.0 - 2026-09-13

- Initial release.
- Keep original Filament table headers visible while vertically scrolling.
- Add automatic topbar offset detection and end-of-table clamping.
- Add nested scroll container, modal, grouped-header, RTL, dark mode, Livewire, and SPA support.
- Add a global configuration switch and optional custom top offset.
