/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'plugins': ['import'],
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    'sourceType': 'module'
  },
  rules: {
    'comma-dangle': 'off',
    'class-methods-use-this': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': ['error', { 'singleQuote': true, 'endOfLine': 'auto' }],
    "no-duplicate-imports": "error",
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1,
        "maxEOF": 0,
        "maxBOF": 0
      }
    ],
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-unassigned-import": "error",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "parent", "sibling", "index"],
        "pathGroups": [
          {
            "pattern": "@/stores",
            "group": "parent",
            "position": "after"
          },
          {
            "pattern": "@/components/**/**",
            "group": "sibling",
            "position": "after"
          },
          {
            "pattern": "@/composables/**",
            "group": "sibling",
            "position": "after"
          },
          {
            "pattern": "@/layouts/**",
            "group": "sibling",
            "position": "before"
          },
          {
            "pattern": "@/services/**",
            "group": "sibling",
            "position": "after"
          },
          {
            "pattern": "@/helpers/**",
            "group": "index",
            "position": "after"
          },
          {
            "pattern": "@/utils/**",
            "group": "index",
            "position": "before"
          },

        ],
        "pathGroupsExcludedImportTypes": ["builtin"],
        "alphabetize": {
          "order": "asc"
        },
        "newlines-between": "always"
      }
    ],
    'sort-imports': [
      'error',
      {
        'allowSeparatedGroups': true,
        'ignoreDeclarationSort': true
      }
    ]
  }
}
