/**
 * Builder provides a fluent API for building a query.
 *
 * Since we'll be running the query on the server, we don't
 * really care about grammars or processors, or even the
 * breakdown of clauses and bindings. Instead, we'll just
 * record which methods are called and with what arguments.
 * This does mean the parameters in our function signatures
 * and docs are not as helpful as they might be - check the
 * Laravel documentation if any are unclear.
 */
export default class Builder {

    /**
     * Create a new Builder instance.
     *
     * @param {Transport} transport
     */
    constructor(transport) {

        if ( ! transport || typeof transport.get !== 'function') {
            throw new Error('Missing argument 1 for Builder, expected Transport');
        }

        /**
         * The transport class to send/receive the query/results.
         *
         * @protected
         * @type {Transport}
         */
        this.transport = transport;

        /**
         * The methods called for this query and their arguments.
         *
         * @protected
         * @type {Array[]}
         */
        this.stack = [];

        /**
         * The endpoint for this query, equivalent to the "table"
         * property in Laravel's Builder.
         *
         * @protected
         * @type {string|null}
         */
        this.endpoint = null;

        /**
         * The Model instance being queried
         *
         * @protected
         * @type {Model|null}
         */
        this._model = null;
    }

    /**
     * Add a method call to the stack.
     *
     * @protected
     * @param {string} name
     * @param {*[]} args
     * @returns {Builder}
     */
    _call(name, args) {
        this.stack.push([name, args]);
        return this;
    }

    /**
     * Set the endpoint for this query.
     *
     * @param {string} endpoint
     * @returns {Builder}
     */
    from(endpoint) {
        this.endpoint = endpoint;
        return this;
    }

    /**
     * Set the columns to be selected.
     *
     * @param {...string} columns
     * @returns {Builder}
     */
    select(...columns) {
        return this._call('select', columns);
    }

    /**
     * Add a new select column to the query.
     *
     * @param {...string} columns
     * @returns {Builder}
     */
    addSelect(...columns) {
        return this._call('addSelect', columns);
    }

    /**
     * Force the query to only return distinct results.
     *
     * @returns {Builder}
     */
    distinct() {
        return this._call('distinct', []);
    }

    /**
     * Add a "where" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    where(...args) {
        return this._call('where', args);
    }

    /**
     * Add a "or where" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    orWhere(...args) {
        return this._call('orWhere', args);
    }

    /**
     * Add a "where between" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereBetween(...args) {
        return this._call('whereBetween', args);
    }

    /**
     * Add a "or where between" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    orWhereBetween(...args) {
        return this._call('orWhereBetween', args);
    }

    /**
     * Add a "where not between" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereNotBetween(...args) {
        return this._call('whereNotBetween', args);
    }

    /**
     * Add a "or where not between" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    orWhereNotBetween(...args) {
        return this._call('orWhereNotBetween', args);
    }

    /**
     * Add a nested "where" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereNested(...args) {
        return this._call('whereNested', args);
    }

    /**
     * Add a "where exists" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereExists(...args) {
        return this._call('whereExists', args);
    }

    /**
     * Add a "or where exists" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    orWhereExists(...args) {
        return this._call('orWhereExists', args);
    }

    /**
     * Add a "where not exists" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereNotExists(...args) {
        return this._call('whereNotExists', args);
    }

    /**
     * Add a "or where not exists" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    orWhereNotExists(...args) {
        return this._call('orWhereNotExists', args);
    }

    /**
     * Add a "where in" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereIn(...args) {
        return this._call('whereIn', args);
    }

    /**
     * Add a "or where in" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    orWhereIn(...args) {
        return this._call('orWhereIn', args);
    }

    /**
     * Add a "where not in" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereNotIn(...args) {
        return this._call('whereNotIn', args);
    }

    /**
     * Add a "or where not in" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    orWhereNotIn(...args) {
        return this._call('orWhereNotIn', args);
    }

    /**
     * Add a "where _ is null" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereNull(...args) {
        return this._call('whereNull', args);
    }

    /**
     * Add a "or where _ is null" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    orWhereNull(...args) {
        return this._call('orWhereNull', args);
    }

    /**
     * Add a "where _ is not null" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereNotNull(...args) {
        return this._call('whereNotNull', args);
    }

    /**
     * Add a "or where _ is not null" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    orWhereNotNull(...args) {
        return this._call('orWhereNotNull', args);
    }

    /**
     * Add a date "where" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereDate(...args) {
        return this._call('whereDate', args);
    }

    /**
     * Add a day "where" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereDay(...args) {
        return this._call('whereDay', args);
    }

    /**
     * Add a month "where" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereMonth(...args) {
        return this._call('whereMonth', args);
    }

    /**
     * Add a year "where" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    whereYear(...args) {
        return this._call('whereYear', args);
    }

    /**
     * Add a "group by" clause to the query.
     *
     * @param {...string} columns
     * @returns {Builder}
     */
    groupBy(...columns) {
        return this._call('groupBy', columns);
    }

    /**
     * Add a "having" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    having(...args) {
        return this._call('having', args);
    }

    /**
     * Add a "or having" clause to the query.
     *
     * @param {...*} args
     * @returns {Builder}
     */
    orHaving(...args) {
        return this._call('orHaving', args);
    }

    /**
     * Add a "order by" clause to the query.
     *
     * @param {...string} order
     * @returns {Builder}
     */
    orderBy(...order) {
        return this._call('orderBy', order);
    }

    /**
     * Add a "order by" latest date clause to the query.
     *
     * @param {string} [order='created_at']
     * @returns {Builder}
     */
    latest(order) {
        return this._call('latest', order ? [order] : []);
    }

    /**
     * Add an "order by" oldest date clause to the query.
     *
     * @param {string} [order='created_at']
     * @returns {Builder}
     */
    oldest(order) {
        return this._call('oldest', order ? [order] : []);
    }

    /**
     * Set the "offset" value of the query.
     *
     * @param {number} offset
     * @returns {Builder}
     */
    offset(offset) {
        return this._call('offset', [offset]);
    }

    /**
     * Set the "offset" value of the query.
     *
     * @param {number} skip
     * @returns {Builder}
     */
    skip(skip) {
        return this._call('skip', [skip]);
    }

    /**
     * Set the "limit" value of the query.
     *
     * @param {number} limit
     * @returns {Builder}
     */
    limit(limit) {
        return this._call('limit', [limit]);
    }

    /**
     * Set the "limit" value of the query.
     *
     * @param {number} take
     * @returns {Builder}
     */
    take(take) {
        return this._call('take', [take]);
    }

    /**
     * Set the "limit" and "offset" for a given page.
     *
     * @param {...number} forPage
     * @returns {Builder}
     */
    forPage(...forPage) {
        return this._call('forPage', forPage);
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

        return this.transport.get(this.getEndpoint(id))
            .then(result => {
                if ( ! result) {
                    return null;
                }
                return this._model.newInstance(result);
            });
    }

    /**
     * Find many models by their primary key.
     *
     * @param {number[]} ids
     * @param {string[]} [columns]
     * @returns {Promise}
     */
    findMany(ids, columns) {
        return this.whereIn(this._model.getKeyName(), ids).get(columns);
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
        if (columns) {
            this.select(columns);
        }

        return this.transport.get(this.getEndpoint(), this.stack)
            .then(results => this._model.hydrate(results));
    }

    /**
     * Insert a new record into the database.
     *
     * @param values
     * @returns {Promise}
     */
    insert(values) {
        return this.transport.post(this.getEndpoint(), values);
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
     * Get the endpoint for the query.
     *
     * @param {boolean} [withId] append a model ID to the endpoint
     * @returns {string|null}
     * @throws {Error} when endpoint is not set
     */
    getEndpoint(key) {
        if ( ! this.endpoint) {
            throw new Error('Endpoint is required but is not set.');
        }

        if (key) {
            return this.endpoint + '/' + key;
        }

        return this.endpoint;
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
     * @returns {void}
     */
    _setModel(model) {
        this._model = model;
        this.from(model.definition.endpoint);

        // Laravel uses the PHP __call magic to refer back to the
        // underlying model instance to handle any scope calls.
        // Since we can't do that (yet), we'll settle for simply
        // copying the scope methods from the model at runtime.
        (model.definition.scopes || []).forEach(name => {
            this[name] = function (...args) {
                this.scope(name, args);
                return this;
            };
        });
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
