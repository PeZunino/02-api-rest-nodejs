import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: [
			'**/*.{js,mjs,cjs,ts}'
		],
		ignores:[
			'build/**/*', 'node_modules/*'
		],
		languageOptions: {globals: globals.node},
		plugins: {
			'@stylistic': stylistic,
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			semi: 'error',
			'@stylistic/object-curly-newline': [
				'error', 
				{
					'ObjectExpression': {
						'multiline': true,
						'minProperties': 2 
					},
					'ObjectPattern': {
						'multiline': true,
						'minProperties': 2 
					}
				}
			],
			'@stylistic/array-bracket-newline': [
				'error', {'minItems':1}
			],
			'@stylistic/brace-style': [
				'error', '1tbs'
			],
			'@stylistic/newline-per-chained-call': [
				'error', {'ignoreChainWithDepth': 1}
			],
			'@stylistic/indent': [
				'error', 'tab'
			],
			'@stylistic/quotes': [
				'error', 'single'
			],
			
			'@stylistic/object-property-newline': 'error',
			'@stylistic/no-multi-spaces': 'error',
			'@stylistic/space-infix-ops': 'error',
			'@stylistic/padding-line-between-statements':[
				'error',{
					blankLine: 'always',
					prev: '*',
					next: '*'
				},
				{
					blankLine: 'any',
					prev: 'import',
					next: '*'
				},
			],
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						[
							'^\\u0000', '^node:', '^@?\\w', '^', '^\\.'
						]
					]
				},
			],
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
];