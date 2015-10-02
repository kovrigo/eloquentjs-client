import Builder from './Builder';
import {omit} from 'lodash';

export default class Model {

    constructor(attributes = {}) {
        Object.defineProperty(this, 'original', {
            value: attributes
        });
        Object.assign(this, attributes);
    }

    getAttribute(key) {
        return this[key];
    }

    setAttribute(key, value) {
        this[key] = value;
        return this;
    }

    getAttributes() {
        return Object.assign({}, this);
    }

    getDirty() {
        return omit(this.getAttributes(), (value, prop) => {
            return this.original[prop] == value;
        });
    }

    static where(...args) {
        console.log(args);
    }
}
