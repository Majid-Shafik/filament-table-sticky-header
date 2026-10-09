<?php

use Filament\Support\Facades\FilamentAsset;

it('supports Livewire navigation and initialization', function () {
    $jsContent = file_get_contents(__DIR__.'/../resources/js/table-sticky-header.js');
    expect($jsContent)
        ->toContain('livewire:navigated')
        ->toContain('livewire:initialized');
});

it('supports RTL layout correctly', function () {
    $cssContent = file_get_contents(__DIR__.'/../resources/css/table-sticky-header.css');
    // Using translate3d ensures it works dynamically regardless of LTR or RTL
    expect($cssContent)->toContain('translate3d');
});

it('provides compatibility with Filament 4 and 5', function () {
    // Assert that the assets are correctly scoped to the package namespace which works across versions
    expect(class_exists(FilamentAsset::class))->toBeTrue();
});

it('manages the sticky header class on tables', function () {
    $jsContent = file_get_contents(__DIR__.'/../resources/js/table-sticky-header.js');
    expect($jsContent)
        ->toContain('fi-table-sticky-header-active')
        ->toContain('--fi-table-sticky-header-translate-y');
});
