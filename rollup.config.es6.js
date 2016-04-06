import babel from 'rollup-plugin-babel';
import config from './rollup.config';

export default Object.assign(config, {
    format: 'es6'
});
