import Builder from './Eloquent/Builder';
import Model from './Eloquent/Model';
import Connection from './Connection/RestfulJsonConnection';
import Container from './Container';

let container = new Container();

/**
 * Define or retrieve a model definition.
 *
 * @param {string} name
 * @param {Object|function(base: Model): Model|undefined} [definition]
 *
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

    if ( ! Eloquent.booted) {
        Eloquent.boot();
    }

    if (definition) {
        Object.defineProperty(Eloquent, name, {
            get: function () {
                return container.make(name);
            }
        });

        let init = definition;

        if (typeof definition !== 'function') {
            init = function (BaseModel) {
                return Object.assign(BaseModel, definition);
            };
        }

        container.resolving(name, function (BaseModel) {
            let Model = init(BaseModel);
            Model.prototype.bootIfNotBooted();
            return Model;
        });

        return container.register(name, class extends (container.get('Model')) {});
    }

    return container.make(name);
};

/**
 * Bootstrap our Eloquent implementation by registering some default bindings.
 *
 * @returns {void}
 */
Eloquent.boot = function () {

    Eloquent.booted = true;

    container.register('Builder', Builder);
    container.register('Connection', Connection);
    container.register('Model', Model);

    container.resolving('Builder', function (Builder, container) {
        return new Builder(container.make('Connection'));
    });

};

/*
 * Exports
 */
export default Eloquent;
export {
    container as app,
    Container,
    Builder,
    Model,
    Connection
};