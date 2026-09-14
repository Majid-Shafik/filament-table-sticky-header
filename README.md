# Filament Table Sticky Header

[![Latest Version on Packagist](https://img.shields.io/packagist/v/majid-shafik/filament-table-sticky-header.svg?style=flat-square)](https://packagist.org/packages/majid-shafik/filament-table-sticky-header)
[![Tests](https://img.shields.io/github/actions/workflow/status/Majid-Shafik/filament-table-sticky-header/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/Majid-Shafik/filament-table-sticky-header/actions)
[![Total Downloads](https://img.shields.io/packagist/dt/majid-shafik/filament-table-sticky-header.svg?style=flat-square)](https://packagist.org/packages/majid-shafik/filament-table-sticky-header)

Keep Filament table headers visible while scrolling long tables. The package moves the original table header, so sorting, selection, tooltips, Livewire actions, and horizontal scrolling continue to work without cloned controls.

## Features

- Applies automatically to Filament tables across the panel.
- Keeps the original interactive `<thead>` in the DOM.
- Stops the header at the end of its table.
- Detects Filament's topbar height automatically.
- Supports nested scroll containers and modal headers.
- Supports grouped columns, RTL layouts, dark mode, Livewire updates, and SPA navigation.
- Avoids the stacked mobile card layout automatically.
- Works alongside `majid-shafik/filament-table-drag-scroll`.
- Requires no JavaScript build step and does not modify Filament vendor files.

## Requirements

- PHP 8.2 or newer.
- Filament 3.x, 4.x, or 5.x.
- A modern browser with `ResizeObserver` support.

## Installation

Install the package through Composer:

```bash
composer require majid-shafik/filament-table-sticky-header
```

Publish Filament assets, then refresh the browser:

```bash
php artisan filament:assets
```

No panel provider changes are required. Laravel package discovery enables the package automatically.

## Configuration

Publish the config file:

```bash
php artisan vendor:publish --tag="filament-table-sticky-header-config"
```

The package has one global on/off switch. Leave `top_offset` as `null` to detect Filament's topbar automatically:

```php
return [
    'enabled' => true,
    'top_offset' => null,
];
```

Set `enabled` to `false` to disable sticky headers across the system. When a panel has an additional fixed header, set `top_offset` to its total height in pixels:

```php
'top_offset' => 96,
```

Rebuild the application's configuration cache after changing a cached production configuration.

## How it works

Filament's table content container uses horizontal overflow, which makes a CSS-only viewport-sticky header unreliable. This package calculates the correct vertical offset in a throttled animation frame and translates the original `<thead>`. A `ResizeObserver` and a DOM observer keep measurements current after responsive changes and Livewire morphs.

## Testing

```bash
composer test
composer test:lint
composer analyse
node --check resources/js/table-sticky-header.js
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## Security

Please report security issues privately as described in [SECURITY.md](.github/SECURITY.md).

## License

The MIT License. See [LICENSE.md](LICENSE.md).
