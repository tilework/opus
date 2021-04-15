import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const pkg = require('./package.json');

const bundle = config => ({
    ...config,
    input: 'src/index.ts',
    external: id => !/^[./]/.test(id)
});

export default [
    bundle({
        plugins: [esbuild({ minify: true })],
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: false
            }
        ]
    }),
    bundle({
        plugins: [dts()],
        output: {
            file: pkg.typings,
            format: 'es'
        }
    })
];