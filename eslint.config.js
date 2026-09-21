// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// Any string that is exactly a hex colour (#rgb, #rgba, #rrggbb, #rrggbbaa).
const HEX_COLOR = '/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/';

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'legacy/*', 'scripts/*'],
  },
  {
    // Colours live only in src/theme. Everywhere else must use useTheme() tokens.
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['src/theme/**', 'scripts/**', 'legacy/**', 'dist/**', '*.config.js'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=${HEX_COLOR}]`,
          message:
            'No hex colour literals outside src/theme — use theme tokens via useTheme().',
        },
        {
          selector: `TemplateElement[value.raw=${HEX_COLOR}]`,
          message:
            'No hex colour literals outside src/theme — use theme tokens via useTheme().',
        },
      ],
    },
  },
]);
