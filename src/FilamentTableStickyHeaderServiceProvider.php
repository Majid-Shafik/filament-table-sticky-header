<?php

namespace MajidShafik\FilamentTableStickyHeader;

use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentTableStickyHeaderServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-table-sticky-header';

    public const ASSET_PACKAGE = 'majid-shafik/filament-table-sticky-header';

    public function configurePackage(Package $package): void
    {
        $package
            ->name(static::$name)
            ->hasConfigFile();
    }

    public function packageBooted(): void
    {
        if (! config('filament-table-sticky-header.enabled', true)) {
            return;
        }

        FilamentAsset::register([
            Css::make('table-sticky-header', __DIR__.'/../resources/css/table-sticky-header.css'),
            Js::make('table-sticky-header', __DIR__.'/../resources/js/table-sticky-header.js')->defer(),
        ], package: self::ASSET_PACKAGE);

        FilamentAsset::registerScriptData([
            'filamentTableStickyHeader' => [
                'topOffset' => config('filament-table-sticky-header.top_offset'),
            ],
        ], package: self::ASSET_PACKAGE);
    }
}
