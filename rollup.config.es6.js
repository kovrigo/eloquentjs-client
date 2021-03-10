import config from './rollup.config';

export default Object.assign(config, {
    //entry: 'src/index.es6.js',
    //format: 'es6'
    input: 'src/index.es6.js',
	output: {
		format: 'es6',
	},    
});
