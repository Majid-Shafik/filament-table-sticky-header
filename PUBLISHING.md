# Publishing checklist

1. Test this package inside a clean Filament 5 application with long, grouped, selectable, and horizontally overflowing tables.
2. Add a screenshot or short GIF that demonstrates the sticky header and horizontal synchronization.
3. Create a public GitHub repository named `filament-table-sticky-header` under the `Majid-Shafik` account.
4. Copy this package directory's contents to the repository root.
5. Push the `main` branch and confirm that GitHub Actions pass.
6. Create and push the first stable tag:

   ```bash
   git tag -a v1.0.0 -m "Initial release"
   git push origin v1.0.0
   ```

7. Submit `https://github.com/Majid-Shafik/filament-table-sticky-header` to Packagist.
8. Confirm that Packagist detects version `v1.0.0` and that installation works from Packagist.
9. Sign in at `https://filamentphp.com/author` with GitHub and use **Submit plugins** to submit the Packagist package.

Do not publish the tag until the browser interaction has been verified in a clean Filament 5 application.
