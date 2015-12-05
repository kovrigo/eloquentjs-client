/**
 * QueryBuilder provides a fluent API for building a query.
 *
 * Since we'll be running the query on the server, we don't
 * really care about grammars or processors, or even the
 * breakdown of clauses and bindings. Instead, we'll just
 * record which methods are called and with what arguments.
 * This does mean the parameters in our function signatures
 * and docs are not as helpful as they might be - check the
 * Laravel documentation if any are unclear.
 */
export default class QueryBuilder {

    /**
     * Create a new QueryBuilder instance.
     *
     * @param {Transport} transport
     */
    constructor(transport) {

        if ( ! transport || typeof transport.get !== 'function') {
            throw new Error('Missing argument 1 for QueryBuilder, expected Transport');
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
    }

    /**
     * Add a method call to the stack.
     *
     * @protected
     * @param {string} name
     * @param {*[]} args
     * @returns {QueryBuilder}
     */
    _call(name, args) {
        this.stack.push([name, args]);
        return this;
    }

    /**
     * Set the endpoint for this query.
     *
     * @param {string} endpoint
     * @returns {QueryBuilder}
     */
    from(endpoint) {
        this.endpoint = endpoint;
        return this;
    }

    /**
     * Set the columns to be selected.
     *
     * @param {...string} columns
     * @returns {QueryBuilder}
     */
    select(...columns) {
        return this._call('select', columns);
    }

    /**
     * Add a new select column to the query.
     *
     * @param {...string} columns
     * @returns {QueryBuilder}
     */
    addSelect(...columns) {
        return this._call('addSelect', columns);
    }

    /**
     * Force the query to only return distinct results.
     *
     * @returns {QueryBuilder}
     */
    distinct() {
        return this._call('distinct', []);
    }

    /**
     * Add a "where" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    where(...args) {
        return this._call('where', args);
    }

    /**
     * Add a "or where" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    orWhere(...args) {
        return this._call('orWhere', args);
    }

    /**
     * Add a "where between" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereBetween(...args) {
        return this._call('whereBetween', args);
    }

    /**
     * Add a "or where between" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    orWhereBetween(...args) {
        return this._call('orWhereBetween', args);
    }

    /**
     * Add a "where not between" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereNotBetween(...args) {
        return this._call('whereNotBetween', args);
    }

    /**
     * Add a "or where not between" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    orWhereNotBetween(...args) {
        return this._call('orWhereNotBetween', args);
    }

    /**
     * Add a nested "where" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereNested(...args) {
        return this._call('whereNested', args);
    }

    /**
     * Add a "where exists" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereExists(...args) {
        return this._call('whereExists', args);
    }

    /**
     * Add a "or where exists" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    orWhereExists(...args) {
        return this._call('orWhereExists', args);
    }

    /**
     * Add a "where not exists" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereNotExists(...args) {
        return this._call('whereNotExists', args);
    }

    /**
     * Add a "or where not exists" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    orWhereNotExists(...args) {
        return this._call('orWhereNotExists', args);
    }

    /**
     * Add a "where in" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereIn(...args) {
        return this._call('whereIn', args);
    }

    /**
     * Add a "or where in" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    orWhereIn(...args) {
        return this._call('orWhereIn', args);
    }

    /**
     * Add a "where not in" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereNotIn(...args) {
        return this._call('whereNotIn', args);
    }

    /**
     * Add a "or where not in" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    orWhereNotIn(...args) {
        return this._call('orWhereNotIn', args);
    }

    /**
     * Add a "where _ is null" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereNull(...args) {
        return this._call('whereNull', args);
    }

    /**
     * Add a "or where _ is null" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    orWhereNull(...args) {
        return this._call('orWhereNull', args);
    }

    /**
     * Add a "where _ is not null" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereNotNull(...args) {
        return this._call('whereNotNull', args);
    }

    /**
     * Add a "or where _ is not null" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    orWhereNotNull(...args) {
        return this._call('orWhereNotNull', args);
    }

    /**
     * Add a date "where" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereDate(...args) {
        return this._call('whereDate', args);
    }

    /**
     * Add a day "where" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereDay(...args) {
        return this._call('whereDay', args);
    }

    /**
     * Add a month "where" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereMonth(...args) {
        return this._call('whereMonth', args);
    }

    /**
     * Add a year "where" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    whereYear(...args) {
        return this._call('whereYear', args);
    }

    /**
     * Add a "group by" clause to the query.
     *
     * @param {...string} columns
     * @returns {QueryBuilder}
     */
    groupBy(...columns) {
        return this._call('groupBy', columns);
    }

    /**
     * Add a "having" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    having(...args) {
        return this._call('having', args);
    }

    /**
     * Add a "or having" clause to the query.
     *
     * @param {...*} args
     * @returns {QueryBuilder}
     */
    orHaving(...args) {
        return this._call('orHaving', args);
    }

    /**
     * Add a "order by" clause to the query.
     *
     * @param {...string} order
     * @returns {QueryBuilder}
     */
    orderBy(...order) {
        return this._call('orderBy', order);
    }

    /**
     * Add a "order by" latest date clause to the query.
     *
     * @param {string} [order='created_at']
     * @returns {QueryBuilder}
     */
    latest(order) {
        return this._call('latest', order ? [order] : []);
    }

    /**
     * Add an "order by" oldest date clause to the query.
     *
     * @param {string} [order='created_at']
     * @returns {QueryBuilder}
     */
    oldest(order) {
        return this._call('oldest', order ? [order] : []);
    }

    /**
     * Set the "offset" value of the query.
     *
     * @param {number} offset
     * @returns {QueryBuilder}
     */
    offset(offset) {
        return this._call('offset', [offset]);
    }

    /**
     * Set the "offset" value of the query.
     *
     * @param {number} skip
     * @returns {QueryBuilder}
     */
    skip(skip) {
        return this._call('skip', [skip]);
    }

    /**
     * Set the "limit" value of the query.
     *
     * @param {number} limit
     * @returns {QueryBuilder}
     */
    limit(limit) {
        return this._call('limit', [limit]);
    }

    /**
     * Set the "limit" value of the query.
     *
     * @param {number} take
     * @returns {QueryBuilder}
     */
    take(take) {
        return this._call('take', [take]);
    }

    /**
     * Set the "limit" and "offset" for a given page.
     *
     * @param {...number} forPage
     * @returns {QueryBuilder}
     */
    forPage(...forPage) {
        return this._call('forPage', forPage);
    }

    /**
     * Execute the query as a "select" statement.
     *
     * @param {...string} [columns]
     * @returns {Promise}
     */
    get(columns) {
        if (columns) {
            this.select(columns);
        }

        return this.transport.get(this.getEndpoint(), this.stack);
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
     * @param {Object} values
     * @returns {Promise}
     */
    update(values) {
        return this.transport.put(this.getEndpoint(), values, this.stack);
    }

    /**
     * Execute the query as a "delete" statement.
     *
     * @returns {Promise}
     */
    delete() {
        return this.transport.delete(this.getEndpoint(), this.stack);
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
}
