<?php

namespace MajidShafik\FilamentTableStickyHeader\Tests;

use MajidShafik\FilamentTableStickyHeader\FilamentTableStickyHeaderServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

abstract class TestCase extends Orchestra
{
    protected function getPackageProviders($app): array
    {
        return [
            FilamentTableStickyHeaderServiceProvider::class,
        ];
    }
}
