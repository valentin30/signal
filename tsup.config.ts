import { defineConfig, Options } from 'tsup'

const options: Options = {
    format: ['esm'],
    target: 'es2020',
    outDir: 'dist',
    clean: false,
    splitting: true,
    treeshake: true,
    skipNodeModulesBundle: true,
    external: ['react', 'react-dom'],
    tsconfig: 'tsconfig.build.json',
}

function config(...names: string[]) {
    return defineConfig([js(...names), ...names.map(n => dts(n))])
}

function js(...names: string[]): Options {
    const entry = names.reduce((acc, name) => ({ ...acc, [name]: 'src/packages/' + name + '.ts' }), {})
    return { entry, dts: false, ...options }
}

function dts(...names: string[]): Options {
    const entry = names.reduce((acc, name) => ({ ...acc, [name]: 'src/packages/' + name + '.ts' }), {})
    return { entry, dts: { only: true, entry }, ...options }
}

export default config(
    //
    'core',
    'core/signal',
    'core/computed',
    'core/context',
    'core/scheduler',
    //
    'react',
    'react/use-signal',
    'react/use-computed',
    'react/use-read',
    //
    'event',
    'event/channel',
    'event/effect',
    'event/notifier',
    //
    'builder',
    'builder/value',
    'builder/node',
    'builder/sources',
    'builder/consumers',
    //
)
