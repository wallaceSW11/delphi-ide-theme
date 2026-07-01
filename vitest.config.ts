import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['src/**/*.test.ts'],
        passWithNoTests: true,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/extension.ts', 'src/semanticTokens.ts', 'src/**/*.test.ts'],
            thresholds: { lines: 100, branches: 100, functions: 100, statements: 100 },
        },
    },
});
