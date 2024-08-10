// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ["lib", "test", "jest.config.js", "eslint.config.mjs"] },
    eslint.configs.recommended,
    ...tseslint.configs.stylistic,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ["*.config.*"],
                    defaultProject: "tsconfig.json"
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
);
