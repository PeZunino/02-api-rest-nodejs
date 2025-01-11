import globals from 'globals';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
  
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.node },
		plugins:{
			'@stylistic': stylistic    
		},
		rules:{
			semi: 'error',
			'@stylistic/newline-per-chained-call':['error',{ 'ignoreChainWithDepth': 1 }],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'single']
		}

	},

	pluginJs.configs.recommended,

];