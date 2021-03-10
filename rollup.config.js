import babel from 'rollup-plugin-babel';

export default {

	input: 'src/index.js',
	output: {
		format: 'umd',
		name: 'Eloquent',
	},
	plugins: [
		babel({
			presets: ['@babel/env'],
			babelrc: false
		})
	]
    //entry: 'src/index.js',
    //format: 'umd',
    //moduleName: 'Eloquent',
};
