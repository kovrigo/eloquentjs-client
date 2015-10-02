/**
 * QueryBuilder
 *
 * This provides the same API as Laravel's Query Builder, but
 * contains none of the implementation. We only need to keep
 * track of which methods were called and their arguments.
 *
 * @see API based on https://github.com/laravel/framework/blob/5.1/src/Illuminate/Database/Query/Builder.php
 */
export default class Builder {

    constructor(transport) {
        this.transport = transport;
        this.stack     = [];
        this.endpoint  = null;
    }

    _call(name, args) {
        this.stack.push([name, args]);
        return this;
    }

    from(endpoint) {
        this.endpoint = endpoint;
        return this;
    }

    select(...columns) { return this._call('select', columns); }
    addSelect(...columns) { return this._call('addSelect', columns); }

    distinct(...args) { return this._call('distinct', args); }

    where(...args) { return this._call('where', args); }
    orWhere(...args) { return this._call('orWhere', args); }
    orWhere(...args) { return this._call('orWhere', args); }
    whereBetween(...args) { return this._call('whereBetween', args); }
    orWhereBetween(...args) { return this._call('orWhereBetween', args); }
    whereNotBetween(...args) { return this._call('whereNotBetween', args); }
    orWhereNotBetween(...args) { return this._call('orWhereNotBetween', args); }
    whereNested(...args) { return this._call('whereNested', args); }
    whereExists(...args) { return this._call('whereExists', args); }
    orWhereExists(...args) { return this._call('orWhereExists', args); }
    whereNotExists(...args) { return this._call('whereNotExists', args); }
    orWhereNotExists(...args) { return this._call('orWhereNotExists', args); }
    whereIn(...args) { return this._call('whereIn', args); }
    orWhereIn(...args) { return this._call('orWhereIn', args); }
    whereNotIn(...args) { return this._call('whereNotIn', args); }
    orWhereNotIn(...args) { return this._call('orWhereNotIn', args); }
    whereNull(...args) { return this._call('whereNull', args); }
    orWhereNull(...args) { return this._call('orWhereNull', args); }
    whereNotNull(...args) { return this._call('whereNotNull', args); }
    orWhereNotNull(...args) { return this._call('orWhereNotNull', args); }
    whereDate(...args) { return this._call('whereDate', args); }
    whereDay(...args) { return this._call('whereDay', args); }
    whereMonth(...args) { return this._call('whereMonth', args); }
    whereYear(...args) { return this._call('whereYear', args); }

    groupBy(...columns) { return this._call('groupBy', columns); }

    having(...columns) { return this._call('having', columns); }
    orHaving(...columns) { return this._call('orHaving', columns); }

    orderBy(...order) { return this._call('orderBy', order); }
    latest(...order) { return this._call('latest', order); }
    oldest(...order) { return this._call('oldest', order); }

    offset(...offset) { return this._call('offset', offset); }
    skip(...skip) { return this._call('skip', skip); }
    limit(...limit) { return this._call('limit', limit); }
    take(...take) { return this._call('take', take); }
    forPage(...forPage) { return this._call('forPage', forPage); }

    get(columns) {
        if (columns) {
            this.select(columns);
        }

        if ( ! this.endpoint) {
            throw new Error('Attempted to execute query without an endpoint.');
        }

        if ( ! this.transport) {
            throw new Error('Attempted to execute query without a transport.');
        }

        return this.transport.get(this.endpoint, this.stack);
    }
}
