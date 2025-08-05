import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		ignores: ['postcss.config.js'],
		plugins: {
			'@typescript-eslint': typescriptEslint,
		},
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			...typescriptEslint.configs.recommended.rules,
			...prettierConfig.rules,

			// Disable strict type checking rules for now
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-misused-promises': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',

			// Keep some useful rules
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports',
				},
			],

			// Basic formatting rules
			quotes: [
				'error',
				'single',
				{
					avoidEscape: true,
					allowTemplateLiterals: true,
				},
			],
			semi: ['error', 'always'],
			'no-multiple-empty-lines': [
				'error',
				{
					max: 1,
					maxEOF: 1,
					maxBOF: 0,
				},
			],
			'no-trailing-spaces': ['error'],
		},
	},
	{
		files: ['postcss.config.js', 'tailwind.config.ts'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
	{
		ignores: ['node_modules/**', 'build/**', '.plasmo/**', 'dist/**'],
	},
];
