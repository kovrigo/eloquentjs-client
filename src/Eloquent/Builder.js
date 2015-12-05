import QueryBuilder from '../Query/Builder';

/**
 * EloquentBuilder extends the QueryBuilder and adds support
 * for relationships, as well as syntactic sugar for finding
 * records by primary key, handling no results, etc.
 */
export default class EloquentBuilder extends QueryBuilder {

    /**
     * Create a new Eloquent Builder instance.
     *
     * @param {Transport} transport
     */
    constructor(transport) {

        super(transport);

        /**
         * The Model instance being queried
         *
         * @protected
         * @type {Model|null}
         */
        this._model = null;
    }

    /**
     * Find a model by its primary key.
     *
     * @param {number}   id
     * @param {string[]} [columns] the columns to fetch
     * @returns {Promise}
     */
    find(id, columns) {
        if (Array.isArray(id)) {
            return this.findMany(id, columns);
        }
        return this.where(this._model.primaryKey, id).first();
    }

    /**
     * Find many models by their primary key.
     *
     * @param {number[]} ids
     * @param {string[]} [columns]
     * @returns {Promise}
     */
    findMany(ids, columns) {
        return this.whereIn(this._model.primaryKey, ids).get(columns);
    }

    /**
     * Find a model by its primary key or throw an exception.
     *
     * @param {number}   id
     * @param {string[]} [columns]
     * @returns {Promise}
     */
    findOrFail(id, columns) {
        return this.find(id, columns).then(throwIfNotFound);
    }

    /**
     * Execute the query and get the first result.
     *
     * @param {string[]} [columns]
     * @returns {Promise}
     */
    first(columns) {
        return this.limit(1).get(columns).then(unwrapFirst);
    }

    /**
     * Execute the query and get the first result or throw an exception.
     *
     * @param {string[]} [columns]
     * @returns {Promise}
     */
    firstOrFail(columns) {
        return this.first(columns).then(throwIfNotFound);
    }

    /**
     * Get a single column's value from the first result of a query.
     *
     * @param {string} column
     * @returns {Promise}
     */
    value(column) {
        return this.first(column).then(function (result) {
            return result[column];
        });
    }

    /**
     * Get a single column's value from the first result of a query.
     *
     * This is an alias for the "value" method.
     *
     * @param {string} column
     * @returns {Promise}
     */
    pluck(column) {
        return this.value(column);
    }

    /**
     * Get an array with the values of a given column.
     *
     * @param {string} column
     * @returns {Promise}
     */
    lists(column) {
        return this.get(column).then(function (results) {
            return results.map(function (result) {
                return result[column];
            });
        });
    }

    /**
     * Set the relationships that should be eager loaded.
     *
     * @param {string[]} relations
     * @returns {EloquentBuilder}
     */
    with(...relations) {
        this._call('with', relations);
        return this;
    }

    /**
     * Execute the query and return a promise that resolves with an array of models.
     *
     * @param {string|string[]} [columns]
     * @returns {Promise}
     */
    get(columns) {
        return super.get(columns).then((results) => this._model.hydrate(results));
    }

    /**
     * Execute the query as an "update" statement.
     *
     * There are two ways of running an update - on an existing
     * model, e.g. `post.update()`, or via the query builder, e.g.
     * `Post.where(...).update()`.
     *
     * The former is straightforward to implement. We can simply set
     * up our RESTful controller in Laravel and make a PUT request to
     * /resource/{id}. The latter is more complex because we don't have
     * an ID.
     *
     * To support this, we use `*` in place of the ID to refer to all models.
     * The various query clauses can then be sent to the server in
     * just the same way as we would do for a GET, i.e. in URL's query
     * string.
     *
     * Note this overrides update() on the child QueryBuilder class. This
     * method differs in the automatic addition of an ID (or wildcard) to
     * the endpoint URL, whereas QueryBuilder.update uses the configured
     * endpoint as-is.
     *
     * @param  {object} values
     * @return {Promise}
     */
    update(values) {
        return this.transport.put(this.getEndpoint(this._model.getKey() || '*'), values, this.stack);
    }

    /**
     * Execute the query as a "delete" statement.
     *
     * See comments on update() - similar situation here.
     *
     * @return {Promise}
     */
    delete() {
        return this.transport.delete(this.getEndpoint(this._model.getKey() || '*'), this.stack);
    }

    /**
     * Add a scope call to the query.
     *
     * @param {string} scopeName
     * @param {*[]} scopeArgs
     * @returns {EloquentBuilder}
     */
    scope(scopeName, scopeArgs) {
        let args = [scopeName];
        if (scopeArgs) {
            args.push(scopeArgs);
        }
        this._call('scope', args);
        return this;
    }

    /**
     * The Model instance being queried
     *
     * @protected
     * @return {Model} model
     */
    _getModel() {
        return this._model;
    }

    /**
     * The Model instance being queried
     *
     * @protected
     * @param {Model} model
     */
    _setModel(model) {
        this._model = model;
        this.from(model.endpoint);

        // Laravel uses the PHP __call magic to refer back to the
        // underlying model instance to handle any scope calls.
        // Since we can't do that (yet), we'll settle for simply
        // copying the scope methods from the model at runtime.
        if (model.constructor.scopes) {
            model.constructor.scopes.forEach(name => {
                this[name] = function (...args) {
                    this.scope(name, args);
                    return this;
                };
            });
        }
    }
};

function unwrapFirst(results)
{
    return results[0] ? results[0] : null;
}

function throwIfNotFound(result)
{
    if (result === null) {
        throw new Error('ModelNotFoundException');
    }

    return result;
}
