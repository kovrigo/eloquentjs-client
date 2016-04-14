import Builder from './Builder';
import RestConnection from '../Connection/RestConnection';

/**
 * Model class.
 *
 * Conceptually equivalent to the Illuminate\Database\Eloquent\Model
 * class in Laravel.
 */
export default class Model {

    /**
     * Create a new Model instance.
     *
     * @param attributes
     */
    constructor(attributes = {}) {
        this.bootIfNotBooted();

        // Create non-enumerable properties for metadata
        Object.defineProperties(this, {
            original: {
                writable: true
            },
            exists: {
                writable: true
            }
        });

        /**
         * Flag denoting whether or not this model has been persisted.
         *
         * @protected
         * @type {boolean}
         */
        this.exists = false;

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
        /**
         * Flag denoting whether or not this model has already booted.
         *
         * @protected
         * @type {boolean}
         */
        this.booted = true;

        /**
         * The fields which are date columns.
         *
         * @protected
         * @type {string[]}
         */
        this.dates = (this.dates || []);

        /**
         * Map of relation names to relation-factories.
         *
         * @protected
         * @type {{relationName: relationFactory}}
         */
        this.relations = (this.relations || {});

        /**
         * The names of the scope methods for this model.
         *
         * @protected
         * @type {string[]}
         */
        this.scopes = this.scopes || [];

        // Create connection if one doesn't already exist
        if ( ! this.prototype.connection)
            this.prototype.connection = new RestConnection(this.endpoint);

        this._bootScopes(this.scopes);
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
        /**
         * The registered event handlers for all models.
         *
         * @type {{eventName: function[]}}
         */
        this.events = {};

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
        let builder = Object.getPrototypeOf(new Builder);

        Object.getOwnPropertyNames(builder)
            .filter(function (name) {
                return (
                    name.charAt(0) !== '_'
                    && name !== 'constructor'
                    && typeof builder[name] === 'function'
                );
            })
            .forEach(function (methodName) {
                // Add to the prototype to handle instance calls
                addMethod(Model.prototype, methodName, function () {
                    let builder = this.newQuery();
                    return builder[methodName].apply(builder, arguments);
                });

                // Add to the Model class directly to handle static calls
                addMethod(Model, methodName, function () {
                    let builder = this.query();
                    return builder[methodName].apply(builder, arguments);
                });
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
        /**
         * The original attributes of this instance.
         *
         * @protected
         * @type {Object}
         */
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
        if (value !== null && this.isDate(key)) {
            value = new Date(value);
            value.toJSON = asUnixTimestamp;
        }

        if (this._isRelation(key)) {
            value = this._makeRelated(key, value);
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

        for (var prop in cloned) {
            // We've only have a shallow clone at the moment,
            // so let's copy the dates separately.
            if (this.isDate(prop)) {
                cloned[prop] = new Date(this[prop]);
                cloned[prop].toJSON = asUnixTimestamp;
            }

            if (this._isRelation(prop)) {
                delete cloned[prop];
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

            if (
                typeof this.original[prop] !== 'undefined'
                &&
                this.original[prop].valueOf() === attributes[prop].valueOf()
            ) {
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
        return this.constructor.primaryKey || 'id';
    }

    /**
     * Check if a column is a date column.
     *
     * @param  {string}  column
     * @returns {Boolean}
     */
    isDate(column) {
        return this.constructor
            .dates
            .concat('created_at', 'updated_at', 'deleted_at')
            .indexOf(column) > -1;
    }

    /**
     * Check if an attribute is a relation.
     *
     * @param  {attribute}  attribute
     * @return {Boolean}
     */
    _isRelation(attribute) {
        return Object.keys(this.constructor.relations).indexOf(attribute) > -1;
    }

    /**
     * Get a new Eloquent query builder for this model.
     *
     * @static
     * @returns {Builder}
     */
    static query() {
        return (new this()).newQuery();
    }

    /**
     * Get a new Eloquent query builder for this model.
     *
     * @returns {Builder}
     */
    newQuery() {
        return new Builder(this.connection, this);
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
        return items.map(attributes => this.newInstance(attributes, true));
    }

    /**
     * Save a new model and eventually return the instance.
     *
     * @param {Object} attributes
     * @returns {Promise}
     */
    static create(attributes = {}) {
        let instance = new this(attributes);
        return instance.save().then(() => instance);
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

        return this.connection
            .update(this.getKey(), this.getDirty())
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

        return this.connection
            .delete(this.getKey())
            .then(success => {
                if (success) {
                    this.exists = false;
                }

                this.triggerEvent('deleted', false);
                return success;
            });
    }

    /**
     * Fetch all models from this connection.
     *
     * @static
     * @param {string|string[]} [columns]
     * @returns {Promise}
     */
    static all(columns) {
        return (new this()).newQuery().get(columns);
    }

    /**
     * Eager load the relations.
     *
     * @param  {...string} relations
     * @return {Promise}
     */
    load(...relations) {
        return this.newQuery()
            .with(relations)
            .first()
            .then(attributes => {

                // Fill in the relations, leave everything else in tact
                relations.forEach(relatedName => {
                    this.setAttribute(relatedName, attributes[relatedName]);
                });

                return this;
            });
    }

    /**
     * Make the related model(s) for the given items.
     *
     * @param  {string} name the name of the related class
     * @param  {object|object[]} attributes model data, or an array where
     *                                      each item is the model data
     * @return {Model|Model[]}
     */
    _makeRelated(name, attributes) {
        let relatedClass = this._getRelatedClass(this.constructor.relations[name]);
        let related = new relatedClass;

        if (Array.isArray(attributes)) {
            return related.hydrate(attributes);
        }

        return related.fill(attributes);
    }

    /**
     * Get a related model class.
     *
     * This method will be replaced by Model.setContainer during normal usage.
     *
     * @param  {string} name
     * @return {Model}
     */
    _getRelatedClass(name) {
        throw new Error(`Cannot make related class [${name}]`);
    }

    /**
     * Set the container instance to use for making related models.
     *
     * @param {Container} container
     * @return {void}
     */
    static setContainer(container) {
        this.prototype._getRelatedClass = (name) => container.make(name);
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
 * @param {boolean} force always attempt to add method, even if property exists
 * @returns {object} the object passed as `obj`
 */
function addMethod(obj, name, method, force)
{
    if (typeof obj[name] !== 'undefined' && ! force) {
        return obj;
    }

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
