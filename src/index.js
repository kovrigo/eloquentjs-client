import EloquentBuilder from './Eloquent/Builder';
import Manager from './Manager';
import Model from './Eloquent/Model';
import QueryBuilder from './Query/Builder';
import Transport from './Query/Transport';

let manager;

/**
 * Define or retrieve a model definition.
 *
 * @param {string} name
 * @param {Object|function(base: Model): Model|undefined} [definition]
 * The definition can be either an object of properties
 * to merge into the class, or a callback that receives
 * the base class and returns an extended class definition.
 * Or, omit this argument to fetch the named model.
 *
 * @example
 * // Define an Eloquent model with an object that
 * // extends the base Model definition.
 * Eloquent('Post', {
 *   endpoint: 'api/posts'
 * });
 *
 * // Define an Eloquent model with a callback
 * Eloquent('Post', function (modelDefinition) {
 *   modelDefinition.endpoint = 'api/posts';
 *   return modelDefinition;
 * });
 *
 * // Fetch a previously defined model
 * let Post = Eloquent('Post');
 *
 * // or
 * let Post = Eloquent.Post;
 *
 * // It's (mostly) the same API as Laravel's Eloquent
 * // so you already know how to query the posts table...
 * Post.whereNotNull('published')
 *     .orderBy('published')
 *     .get()
 *     .then(function (results) {
 *         console.log(results);
 *     });
 *
 * // ... or new up an instance ...
 * let post = new Post({
 *   author: 'David',
 *   body: 'Hello, my name is David.'
 * });
 * console.log(post.author); // David
 *
 * // ... or save a new record ...
 * Post.create({
 *   author: 'Derek',
 *   body: 'Hello David, my name is Derek.'
 * });
 */
let Eloquent = function (name, definition) {

    if ( ! manager) {
        manager = Eloquent.make.Manager();
    }

    if (definition) {
        Object.defineProperty(Eloquent, name, {
            get: function () {
                return manager.named(name);
            }
        });
        return manager.define(name, definition);
    }

    return manager.named(name);
};

/**
 * @type {Object} Eloquent.make
 * @property {function(): EloquentBuilder} Builder
 * @property {function(): Transport} Transport
 * @property {function(): Manager} Manager
 */
Eloquent.make = {
    Builder: function () {
        return new EloquentBuilder(this.Transport());
    },
    Transport: function () {
        return new Transport();
    },
    Manager: function () {
        return new Manager(Model);
    }
};


export default Eloquent;
