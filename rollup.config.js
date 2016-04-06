import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/index.js',
    format: 'umd',
    moduleName: 'Eloquent',
    plugins: [
        babel({
            presets: ['es2015-rollup'],
            babelrc: false
        })
    ]
};
