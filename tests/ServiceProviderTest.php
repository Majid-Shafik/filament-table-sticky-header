<?php

use Filament\Support\Assets\AssetManager;
use Filament\Support\Facades\FilamentAsset;
use MajidShafik\FilamentTableStickyHeader\FilamentTableStickyHeaderServiceProvider;

it('registers the sticky header assets', function () {
    expect(FilamentAsset::getScriptSrc(
        'table-sticky-header',
        FilamentTableStickyHeaderServiceProvider::ASSET_PACKAGE,
    ))->toContain('table-sticky-header.js')
        ->and(FilamentAsset::getStyleHref(
            'table-sticky-header',
            FilamentTableStickyHeaderServiceProvider::ASSET_PACKAGE,
        ))->toContain('table-sticky-header.css');
});

it('loads the default configuration', function () {
    expect(config('filament-table-sticky-header.enabled'))->toBeTrue()
        ->and(config('filament-table-sticky-header.top_offset'))->toBeNull();
});

it('shares the configured top offset with the browser', function () {
    expect(FilamentAsset::getScriptData([
        FilamentTableStickyHeaderServiceProvider::ASSET_PACKAGE,
    ]))->toMatchArray([
        'filamentTableStickyHeader' => [
            'topOffset' => null,
        ],
    ]);
});

it('does not register assets when globally disabled', function () {
    FilamentAsset::swap(new AssetManager);
    config()->set('filament-table-sticky-header.enabled', false);

    (new FilamentTableStickyHeaderServiceProvider(app()))->packageBooted();

    expect(FilamentAsset::getScripts([
        FilamentTableStickyHeaderServiceProvider::ASSET_PACKAGE,
    ]))->toBeEmpty()
        ->and(FilamentAsset::getStyles([
            FilamentTableStickyHeaderServiceProvider::ASSET_PACKAGE,
        ]))->toBeEmpty();
});

it('shares a custom top offset with the browser', function () {
    FilamentAsset::swap(new AssetManager);
    config()->set('filament-table-sticky-header.enabled', true);
    config()->set('filament-table-sticky-header.top_offset', 96);

    (new FilamentTableStickyHeaderServiceProvider(app()))->packageBooted();

    expect(FilamentAsset::getScriptData([
        FilamentTableStickyHeaderServiceProvider::ASSET_PACKAGE,
    ]))->toMatchArray([
        'filamentTableStickyHeader' => [
            'topOffset' => 96,
        ],
    ]);
});
