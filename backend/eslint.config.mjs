import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticTs from "@stylistic/eslint-plugin-ts"
import tseslint from "typescript-eslint"

export default tseslint.config(
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ["*.js"],
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      "@stylistic/ts": stylisticTs,
      "@typescript-eslint": tseslint.plugin
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true }
      ],
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "args": "all",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],

      "@stylistic/ts/type-annotation-spacing": "warn",
      "@stylistic/ts/indent": [
        "warn",
        2,
        {
          "ignoredNodes": [
            "FunctionExpression > .params[decorators.length > 0]",
            "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
            "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key"
          ],
          "SwitchCase": 1
        }
      ],
      "@stylistic/ts/space-before-function-paren": [
        "warn",
        {
          anonymous: "never",
          named: "never",
          asyncArrow: "always"
        }
      ],

      "quotes": ["warn", "double"],
      "semi": ["warn", "always"],
      "eol-last": ["warn", "always"],
      "space-unary-ops": [
        "warn",
        {
          words: true,
          nonwords: false
        }
      ],
      "max-len": [
        "warn",
        {
          code: 110,
          ignorePattern:
            "\\/\\*@i18n\\*\\/|^((import|export)\\s.*\\sfrom)|^((export\\s)?type\\s\\w+\\s?=)|^((\\s+)?@\\w+\\s?\\()"
        }
      ],
      "no-console": [ "warn", { allow: [ "warn", "error" ] } ],
      "no-warning-comments": "warn",
      "space-infix-ops": "warn",
      "no-duplicate-imports": "warn",
      "for-direction": "warn",
      "camelcase": "warn",
      "no-multiple-empty-lines": "warn",
      "no-extra-semi": "warn",
      "no-async-promise-executor": "off",
      "no-dupe-class-members": "off",
      "yoda": "warn",
      "comma-dangle": ["warn", "never"],
      "no-trailing-spaces": "warn",
      "keyword-spacing": "warn",
      "semi-spacing": "warn",
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "always"],
      "space-before-function-paren": "off"
    }
  }
)
