/**
 * Model class
 */
export default class Model {

    /**
     * Create a new Model instance.
     *
     * @param attributes
     */
    constructor(attributes = {}) {
        this.bootIfNotBooted();

        Object.defineProperties(this, {
            original: {
                writable: true
            },
            exists: {
                value: false,
                writable: true
            },
            definition: {
                value: this.constructor
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
        if ( ! this.constructor.booted) {
            this.constructor.boot();
        }
    }

    /**
     * Boot the model.
     *
     * Booting lets us defer much of the setup for using EloquentJs
     * until it's actually needed. This means we can load a single
     * build of EloquentJs on every page and have access to all our
     * models, with minimal impact on performance.
     *
     * There's actually multiple layers to booting, each intending to
     * add just the functionality required at the time. Here we've separated
     * booting the base Model class (i.e. this class) and booting the
     * various child classes.
     *
     * @returns {void}
     */
    static boot() {
        if ( ! Model.booted) {
            this._bootBaseModel();
        }

        this._bootSelf();
    }

    /**
     * Boot the current class.
     *
     * This happens once per model, and is where we can take
     * any configuration values attached as properties of the
     * constructor (which is the `this` in a static ES6 class
     * method, incidentally) and adjust our prototype as needed.
     *
     * @protected
     * @returns {void}
     */
    static _bootSelf() {
        this.booted = true;

        this.dates = (this.dates || []);

        if (this.scopes) {
            this._bootScopes(this.scopes);
        }
    }

    /**
     * Boot the base model class.
     *
     * This is where we can set up functionality that's common
     * to all models, and only needs to happen once regardless
     * of how many child models are used.
     *
     * @protected
     * @returns {void}
     */
    static _bootBaseModel() {
        this.events = {}; // to store event listeners

        /*
         * Check we can get a builder - if not, we can't do much more
         * here, but since there might be a use case for Model without
         * all the query builder type methods (??), we won't throw an error.
         */
        if ( ! Model.builderFactory) {
            return;
        }

        /*
         * Laravel uses the __call() and __callStatic() magic methods
         * to provide easy access to a new query builder instance from
         * the model. The proxies feature of ES6 would allow us to do
         * something similar here, but the browser support isn't there
         * yet. Instead, we'll programmatically add our own proxy functions
         * for every method we want to support.
         *
         * While we *could* add the proxy methods to the base Model class
         * definition, adding at runtime reduces the footprint of our
         * library and should be easier to maintain.
         */
        let builder = Model.builderFactory();

        Object.getOwnPropertyNames(builder)
            .filter(function (name) {
                return (
                    name.charAt(0) !== '_'
                    && name !== 'constructor'
                    && typeof builder[name] === 'function'
                )
            })
            .forEach(function (methodName) {
                // Add to the prototype to handle instance calls
                if (typeof Model.prototype[methodName] === 'undefined') {
                    addMethod(Model.prototype, methodName, function () {
                        let builder = this.newQuery();
                        return builder[methodName].apply(builder, arguments);
                    });
                }
                // Add to the Model class directly to handle static calls
                if (typeof Model[methodName] === 'undefined') {
                    addMethod(Model, methodName, function () {
                        let builder = this.query();
                        return builder[methodName].apply(builder, arguments);
                    });
                }
            });
    }

    /**
     * Boot scopes for this model.
     *
     * Scopes are provided as a simple array since all we want
     * to do is keep track of their calls in the query stack.
     * Here we can add those named scopes as methods on our
     * prototype, ensuring consistency with the Laravel API.
     *
     * @protected
     * @param {string[]} scopes
     * @returns {void}
     */
    static _bootScopes(scopes) {
        scopes.forEach(function (scope) {
            // Add to the prototype for access by model instances
            addMethod(this, scope, function (...args) {
                return this.newQuery().scope(scope, args);
            });
            // Add to the class for static access
            addMethod(this.constructor, scope, function (...args) {
                return this.query().scope(scope, args);
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
        if (this.isDate(key)) {
            value = new Date(value);
            value.toJSON = asUnixTimestamp;
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
        let cloned = Object.assign({}, this);

        // We want to return a copy of the attributes rather than references
        // back to the original values. Strictly we should account for all
        // non-primitives but for now we'll just do the date objects.
        for (var prop in cloned) {
            if (this.isDate(prop)) {
                cloned[prop] = new Date(this[prop]);
                cloned[prop].toJSON = asUnixTimestamp;
            }
        }

        return cloned;
    }

    /**
     * Get the attributes which have changed since construction.
     *
     * @returns {*}
     */
    getDirty() {
        let attributes = this.getAttributes();

        for (let prop in attributes) {
            if (this.original[prop].valueOf() === attributes[prop].valueOf()) {
                delete attributes[prop];
            }
        }

        return attributes;
    }

    /**
     * Get the primary key for this model.
     *
     * @returns {Number|undefined}
     */
    getKey() {
        return this[this.getKeyName()];
    }

    /**
     * Get the name of the primary key column.
     *
     * @returns {string}
     */
    getKeyName() {
        return this.definition.primaryKey || 'id';
    }

    /**
     * Check if a column is a date column.
     *
     * @param  {string}  column
     * @returns {Boolean}
     */
    isDate(column) {
        return this.definition
            .dates
            .concat('created_at', 'updated_at', 'deleted_at')
            .indexOf(column) > -1;
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
        if ( ! Model.builderFactory) {
            throw new Error('Model.builderFactory not set');
        }

        let builder = Model.builderFactory();
        builder._setModel(this);
        return builder;
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
     * Create a collection of models from plain objects.
     *
     * @param {Object[]} items
     * @returns {Model[]}
     */
    hydrate(items) {
        return items.map((attributes) => this.newInstance(attributes, true));
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
            .update(this.getDirty())
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

/**
 * Attach a method (strictly, a property which is a function)
 *
 * @param {object} obj
 * @param {string} name
 * @param {function} method
 * @returns {object} the object passed as `obj`
 */
function addMethod(obj, name, method)
{
    return Object.defineProperty(obj, name, {
        value: method
    });
}

/**
 * Get date as timestamp.
 *
 * @returns {number}
 */
function asUnixTimestamp()
{
    return Math.round(this.valueOf() / 1000);
}