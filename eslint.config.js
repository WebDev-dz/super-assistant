// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
import reactHooks from 'eslint-plugin-react-hooks';

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
