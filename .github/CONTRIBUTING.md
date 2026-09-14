# Contributing

Thank you for considering a contribution.

1. Fork the repository and create a focused branch.
2. Add or update tests for the change.
3. Run the full local verification suite:

   ```bash
   composer test
   composer test:lint
   composer analyse
   node --check resources/js/table-sticky-header.js
   ```

4. Open a pull request that explains the behavior change and how it was verified.

Please keep changes compatible with supported Filament 5 and PHP versions and avoid modifications to Filament vendor files.
