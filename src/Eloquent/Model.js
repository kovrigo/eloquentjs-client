import {omit} from 'lodash';
import Eloquent from '../index';

/**
 * Model
 */
export default class Model {

    /**
     * Create a new Model instance.
     *
     * @param attributes
     */
    constructor(attributes = {}) {
        Object.defineProperty(this, 'original', {
            value: attributes
        });
        Object.assign(this, attributes);
    }

    /**
     * Get the named attribute.
     *
     * @param {string} key
     * @returns {*}
     */
    getAttribute(key) {
        return this[key];
    }

    /**
     * Set the named attribute.
     *
     * @param {string} key
     * @param {*} value
     * @returns {Model}
     */
    setAttribute(key, value) {
        this[key] = value;
        return this;
    }

    /**
     * Get all the attributes of this model.
     *
     * @returns {*}
     */
    getAttributes() {
        return Object.assign({}, this);
    }

    /**
     * Get the attributes which have changed since construction.
     *
     * @returns {*}
     */
    getDirty() {
        return omit(this.getAttributes(), (value, prop) => {
            return this.original[prop] == value;
        });
    }

    /**
     * Get a new Eloquent query builder for this model.
     *
     * @returns {EloquentBuilder}
     */
    newQuery() {
        let builder = Eloquent.make.Builder();
        builder.model = this;
        return builder;
    }

    /**
     * Get a new Eloquent query builder for this model.
     *
     * @returns {EloquentBuilder}
     */
    static query() {
        return (new this()).newQuery();
    }
}
