import QueryBuilder from '../Query/Builder';

/**
 * EloquentBuilder wraps the QueryBuilder to provide eager loading
 * and model hydration, as well as syntactic sugar for fetching by
 * primary key and handling failure.
 */
export default class EloquentBuilder {

    /**
     * Create a new Eloquent Builder instance.
     *
     * @param {QueryBuilder} query
     */
    constructor(query) {

        if ( ! query || ! (query instanceof QueryBuilder)) {
            throw new Error('Missing argument 1 for EloquentBuilder, expected QueryBuilder');
        }

        /**
         * The base QueryBuilder instance.
         *
         * @type {QueryBuilder}
         */
        this.query = query;

        /**
         * The Model instance being queried
         *
         * @ignore
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
        return this.query._call('find', id).get(columns).then(unwrapFirst);
    }

    /**
     * Find many models by their primary key.
     *
     * @param {number[]} ids
     * @param {string[]} [columns]
     * @returns {Promise}
     */
    findMany(ids, columns) {
        return this.query._call('findMany', ids).get(columns);
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
        return this.query.limit(1).get(columns).then(unwrapFirst);
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
        return this.query.get(column).then(function (results) {
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
        this.query._call('with', relations);
        return this;
    }

    /**
     * The Model instance being queried
     *
     * @return {Model} model
     */
    get model() {
        if ( ! this._model) throw new Error('EloquentBuilder has no model');
        return this._model;
    }

    /**
     * The Model instance being queried
     *
     * @param {Model} model
     */
    set model(model) {
        this._model = model;
    }
}

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
