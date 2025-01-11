import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.node },
		plugins: {
			'@stylistic': stylistic,
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			semi: 'error',
			'@stylistic/newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 1 }],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/object-property-newline': 'error',
			'@stylistic/no-multi-spaces': 'error',

			'simple-import-sort/imports': [
				'error',
				{
					groups: [['^\\u0000', '^node:', '^@?\\w', '^', '^\\.']]
				},
			],
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
];
