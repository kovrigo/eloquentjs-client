import Eloquent from '../index';
import EloquentBuilder from './Builder';

let booted = [];

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
        this.bootIfNotBooted();

        let modelDefinition = Object.getPrototypeOf(this).constructor;

        Object.defineProperties(this, {
            original: {
                writable: true
            },
            exists: {
                value: false,
                writable: true
            },
            endpoint: {
                value: modelDefinition.endpoint,
                writable: true
            },
            primaryKey: {
                value: modelDefinition.primaryKey || 'id',
                writable: true
            },
            dates: {
                value: (modelDefinition.dates || []).concat(
                    'created_at', 'updated_at', 'deleted_at'
                )
            }
        });

        this.fill(attributes);

        this._syncOriginal();
    }

    /**
     * Boot model if not already booted.
     *
     * @returns {void}
     */
    bootIfNotBooted() {
        if (booted.indexOf(this.constructor) === -1) {
            this.constructor.boot();
        }
    }

    /**
     * Boot the model
     *
     * This happens once per model and is where we
     * can set up the prototype, based on configuration
     * values attached the constructor.
     *
     * @returns {void}
     */
    static boot() {
        booted.push(this);

        this.events = {};

        if (this.scopes) {
            this._bootScopes(this.scopes);
        }
    }

    /**
     * Boot scopes for this model.
     *
     * Scopes are provided as a simple array since all we want
     * to do is keep track of their calls in the query stack.
     * Here we can add those named scopes as methods on our
     * prototype, ensuring consistency with the Laravel API.
     *
     * @access protected
     * @param {string[]} scopes
     * @returns {void}
     */
    static _bootScopes(scopes) {
        scopes.forEach(function (scope) {
            // Add to the prototype for access by model instances
            Object.defineProperty(this, scope, {
                value: function (...args) {
                    return this.newQuery().scope(scope, args);
                }
            });
            // Add to the class for static access
            Object.defineProperty(this.constructor, scope, {
                value: function (...args) {
                    return this.query().scope(scope, args);
                }
            });
        }, this.prototype);
    }

    /**
     * Fill the model with an object of attributes.
     *
     * This is where Laravel would guard against mass assignment.
     * While it would be possible to implement similar functionality
     * here, the extra complexity it'd introduce doesn't seem worth it,
     * at least for now...
     *
     * @param {object} attributes
     * @returns {Model}
     */
    fill(attributes) {
        for (let key in attributes) {
            this.setAttribute(key, attributes[key]);
        }
        return this;
    }

    /**
     * Sync the original attributes with the current.
     *
     * @access protected
     * @return {void}
     */
    _syncOriginal() {
        this.original = this.getAttributes();
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
        if (this.dates.indexOf(key) > -1) {
            value = new Date(value);
        }

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
        let attributes = this.getAttributes();

        for (let prop in attributes) {
            if (this.original[prop] == attributes[prop]) {
                delete attributes[prop];
            }
        }

        return attributes;
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
     * Save a new model and eventually return the instance.
     *
     * @param {Object} attributes
     * @returns {Promise}
     */
    static create(attributes = {}) {
        let instance = new this(attributes);
        return instance.save().then(success => instance);
    }

    /**
     * Save the model to the database.
     *
     * @returns {Promise}
     */
    save() {
        let request;

        if (this.triggerEvent('saving') === false) {
            return Promise.reject('saving.cancelled');
        }

        if (this.exists) {
            request = this._performUpdate();
        } else {
            request = this._performInsert();
        }

        return request.then(newAttributes => {
            this.exists = true;
            this.triggerEvent('saved', false);
            return this.fill(newAttributes) && this._syncOriginal();
        });
    }

    /**
     * Perform an insert operation.
     *
     * @access protected
     * @return {Promise}
     */
    _performInsert() {
        if (this.triggerEvent('creating') === false) {
            return Promise.reject('creating.cancelled');
        }

        return this.newQuery()
            .insert(this.getAttributes())
            .then(response => {
                this.triggerEvent('created', false);
                return response;
            });
    }

    /**
     * Perform an update operation.
     *
     * @access protected
     * @return {Promise}
     */
    _performUpdate() {
        if (this.triggerEvent('updating') === false) {
            return Promise.reject('updating.cancelled');
        }

        return this.newQuery()
            .from(this.endpoint+'/'+this.getKey())
            .update(this.getAttributes())
            .then(response => {
                this.triggerEvent('updated', false);
                return response;
            });
    }

    /**
     * Update the model.
     *
     * @param  {Object} attributes
     * @returns {Promise}
     */
    update(attributes) {
        if ( ! this.exists) { // provides shortcut to an update on the query builder
            return this.newQuery().update(attributes);
        }

        this.fill(attributes);

        return this.save();
    }

    /**
     * Delete the model.
     *
     * @return {Promise}
     */
    delete() {
        if (this.triggerEvent('deleting') === false) {
            return Promise.reject('deleting.cancelled');
        }

        return this.newQuery()
            .where('id', this.getKey())
            .delete()
            .then(success => {
                if (success) {
                    this.exists = false;
                }
                this.triggerEvent('deleted', false);
                return success;
            });
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

    /**
     * Get the primary key for this model.
     *
     * @returns {Number|undefined}
     */
    getKey() {
        return this[this.primaryKey];
    }

    /**
     * Register a 'creating' event handler.
     *
     * @param  {Function} callback
     * @return {void}
     */
    static creating(callback) {
        this.registerEventHandler('creating', callback);
    }

    /**
     * Register a 'created' event handler.
     *
     * @param  {Function} callback
     * @return {void}
     */
    static created(callback) {
        this.registerEventHandler('created', callback);
    }

    /**
     * Register a 'updating' event handler.
     *
     * @param  {Function} callback
     * @return {void}
     */
    static updating(callback) {
        this.registerEventHandler('updating', callback);
    }

    /**
     * Register a 'updated' event handler.
     *
     * @param  {Function} callback
     * @return {void}
     */
    static updated(callback) {
        this.registerEventHandler('updated', callback);
    }

    /**
     * Register a 'saving' event handler.
     *
     * @param  {Function} callback
     * @return {void}
     */
    static saving(callback) {
        this.registerEventHandler('saving', callback);
    }

    /**
     * Register a 'saved' event handler.
     *
     * @param  {Function} callback
     * @return {void}
     */
    static saved(callback) {
        this.registerEventHandler('saved', callback);
    }

    /**
     * Register a 'deleting' event handler.
     *
     * @param  {Function} callback
     * @return {void}
     */
    static deleting(callback) {
        this.registerEventHandler('deleting', callback);
    }

    /**
     * Register a 'deleted' event handler.
     *
     * @param  {Function} callback
     * @return {void}
     */
    static deleted(callback) {
        this.registerEventHandler('deleted', callback);
    }

    /**
     * Register a handler for the named event.
     *
     * @param  {string} name
     * @param  {Function} handler
     * @return {void}
     */
    static registerEventHandler(name, handler) {
        if ( ! this.events[name]) this.events[name] = [];
        this.events[name].push(handler);
    }

    /**
     * Trigger a model event.
     *
     * @param  {string}  name
     * @param  {Boolean} halt stop calling observers when one returns false
     * @return {void}
     */
    triggerEvent(name, halt = true) {
        let events = this.constructor.events;

        for (let i = 0, length = (events[name] || []).length; i < length; ++i) {
            let response = events[name][i](this);
            if (halt && typeof response !== 'undefined') {
                return response;
            }
        }
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
