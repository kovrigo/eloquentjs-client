import {omit} from 'lodash';
import Eloquent from '../index';
import EloquentBuilder from './Builder';

/**
 * Model
 */
class Model {

    /**
     * Create a new Model instance.
     *
     * @param attributes
     */
    constructor(attributes = {}) {
        Object.defineProperties(this, {
            original: {
                value: attributes
            },
            exists: {
                value: false,
                writable: true
            }
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
        builder._setModel(this);
        return builder;
    }

    /**
     * Create a collection of models from plain objects.
     *
     * @param {Object[]} items
     * @returns {Model[]}
     */
    hydrate(items) {
        return items.map((attributes) => this.newInstance(attributes, true));
    }

    /**
     * Create a new instance of the current model.
     *
     * @param {Object}  attributes
     * @param {boolean} exists
     * @returns {Model}
     */
    newInstance(attributes = {}, exists = false) {
        let instance = new this.constructor(attributes);
        instance.exists = exists;
        return instance;
    }

    /**
     * Get a new Eloquent query builder for this model.
     *
     * @static
     * @returns {EloquentBuilder}
     */
    static query() {
        return (new this()).newQuery();
    }

    /**
     * Fetch all models from this endpoint.
     *
     * @static
     * @param {string|string[]} [columns]
     * @returns {Promise}
     */
    static all(columns) {
        return (new this()).newQuery().get(columns);
    }
}

/*
 * Laravel uses the __call() and __callStatic() magic methods
 * to provide easy access to a new query builder instance from
 * the model. The proxies feature of ES6 would allow us to do
 * something similar here, but the browser support isn't there
 * yet. Instead, we'll programmatically add our own proxy functions
 * for every method we want to support...
 */
getMethods(EloquentBuilder)
    .concat(getMethods(Object.getPrototypeOf(EloquentBuilder)))
    .forEach(function (methodName) {

        // Add to the prototype to handle instance calls
        if (typeof Model.prototype[methodName] === 'undefined') {
            Object.defineProperty(Model.prototype, methodName, {
                value: function () {
                    let builder = this.newQuery();
                    return builder[methodName].apply(builder, arguments);
                }
            });
        }

        // Add to the Model class directly to handle static calls
        if (typeof Model[methodName] === 'undefined') {
            Object.defineProperty(Model, methodName, {
                value: function () {
                    let builder = this.query();
                    return builder[methodName].apply(builder, arguments);
                }
            });
        }
    });

function getMethods(obj)
{
    return Object.getOwnPropertyNames(obj.prototype).filter(function (name) {
        return (
            name.charAt(0) !== '_'
            && name !== 'constructor'
            && typeof obj.prototype[name] === 'function'
        )
    });
}

export default Model;

