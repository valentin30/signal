import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    clean: true,
    format: ['cjs', 'esm'],
    dts: {
        compilerOptions: {
            baseUrl: 'src',
            paths: {
                '@valentin30/signal/*': ['*'],
                '@valentin30/signal': ['index.ts'],
            },
        },
    },
    tsconfig: 'tsconfig.build.json',
})
