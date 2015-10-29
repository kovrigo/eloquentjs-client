import {find} from 'lodash';

/**
 * The manager acts as a registry for your Model definitions.
 * You can define as many Models as you like, since they are
 * stored as factory functions and only instantiated when needed.
 *
 * @example
 * let manager = new Manager(BaseModel);
 *
 * //
 * // To configure your models, use the .define() method.
 * //
 * manager.define('Post', {
 *   endpoint: '/api/posts'
 * });
 *
 * //
 * // For more flexibility, you can use a callback.
 * // This is equivalent to the example above.
 * //
 * manager.define('Post', function (model) {
 *   Object.assign(model, {
 *     endpoint: '/api/posts'
 *   });
 *   return model;
 * });
 *
 * //
 * // Once defined, simply fetch the class with .named()
 * //
 * let Post = manager.named('Post');
 *
 * @desc
 * Note: the default export for the laravel-eloquentjs module
 * is an overloaded factory function that provides syntactic
 * sugar - you likely won't need to use the Manager directly.
 */
export default class Manager {

    /**
     * Create a new Manager instance.
     *
     * @param {Model} BaseModel
     */
    constructor(BaseModel) {
        /**
         * @protected
         * @type {Object[]}
         * @property {string}   name
         * @property {function} factory
         * @property {class}    definition
         */
        this.registry = [];

        /**
         * Factory function, returns the base model class
         * @protected
         * @type {function(): Model}
         */
        this.baseModel = BaseModel;
    }

    /**
     * Defines an Eloquent model.
     *
     * @param {string} name
     * @param {Object|function(base: Model): Model} definition
     * The definition can be either an object of properties
     * to merge into the class, or a callback that receives
     * the base class and returns an extended class definition.
     */
    define(name, definition) {
        let factory = definition;

        if (typeof definition !== 'function') {
            factory = function (model) {
                return Object.assign(model, definition);
            }
        }

        this.registry.push({
            name,
            factory,
            definition: null
        });
    }

    /**
     * Gets the class definition for the named Model.
     *
     * @param   {string} name the name that was used to define() the Model
     * @returns {Model}
     */
    named(name) {
        let registration = this.getRegistryItem(name);

        if (typeof registration === 'undefined') {
            throw new Error('Cannot get definition for undefined model "' + name + '"');
        }

        if ( ! registration.definition) {
            registration.definition = this.createDefinition(registration.factory);
        }

        return registration.definition;
    }

    /**
     * Gets an item from the registry.
     *
     * @protected
     * @param {string} name
     * @returns {Object}
     */
    getRegistryItem(name) {
        return find(this.registry, 'name', name);
    }

    /**
     * Creates a class definition using the given factory function.
     *
     * @protected
     * @param {function(model: Model): Model} factory
     * @returns {Model}
     */
    createDefinition(factory) {
        let baseClass = this.baseModel;
        return factory(class extends baseClass {});
    }
};
