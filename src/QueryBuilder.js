/**
 * QueryBuilder
 *
 * This provides the same API as Laravel's Query Builder, but
 * contains none of the implementation. We only need to keep
 * track of which methods were called and their arguments.
 *
 * @see API based on https://github.com/laravel/framework/blob/5.1/src/Illuminate/Database/Query/Builder.php
 */
export default class QueryBuilder {

    constructor() {
        this.stack = [];
    }

    _stack(name, args) {
        this.stack.push([name, args]);
        return this;
    }

    select(...columns) { return this._stack('select', columns); }
    addSelect(...columns) { return this._stack('addSelect', columns); }

    distinct(...args) { return this._stack('distinct', args); }
    from(...args) { return this._stack('from', args); }

    where(...args) { return this._stack('where', args); }
    orWhere(...args) { return this._stack('orWhere', args); }
    orWhere(...args) { return this._stack('orWhere', args); }
    whereBetween(...args) { return this._stack('whereBetween', args); }
    orWhereBetween(...args) { return this._stack('orWhereBetween', args); }
    whereNotBetween(...args) { return this._stack('whereNotBetween', args); }
    orWhereNotBetween(...args) { return this._stack('orWhereNotBetween', args); }
    whereNested(...args) { return this._stack('whereNested', args); }
    whereExists(...args) { return this._stack('whereExists', args); }
    orWhereExists(...args) { return this._stack('orWhereExists', args); }
    whereNotExists(...args) { return this._stack('whereNotExists', args); }
    orWhereNotExists(...args) { return this._stack('orWhereNotExists', args); }
    whereIn(...args) { return this._stack('whereIn', args); }
    orWhereIn(...args) { return this._stack('orWhereIn', args); }
    whereNotIn(...args) { return this._stack('whereNotIn', args); }
    orWhereNotIn(...args) { return this._stack('orWhereNotIn', args); }
    whereNull(...args) { return this._stack('whereNull', args); }
    orWhereNull(...args) { return this._stack('orWhereNull', args); }
    whereNotNull(...args) { return this._stack('whereNotNull', args); }
    orWhereNotNull(...args) { return this._stack('orWhereNotNull', args); }
    whereDate(...args) { return this._stack('whereDate', args); }
    whereDay(...args) { return this._stack('whereDay', args); }
    whereMonth(...args) { return this._stack('whereMonth', args); }
    whereYear(...args) { return this._stack('whereYear', args); }

    groupBy(...columns) { return this._stack('groupBy', columns); }

    having(...columns) { return this._stack('having', columns); }
    orHaving(...columns) { return this._stack('orHaving', columns); }

    orderBy(...order) { return this._stack('orderBy', order); }
    latest(...order) { return this._stack('latest', order); }
    oldest(...order) { return this._stack('oldest', order); }

    offset(...offset) { return this._stack('offset', offset); }
    skip(...skip) { return this._stack('skip', skip); }
    limit(...limit) { return this._stack('limit', limit); }
    take(...take) { return this._stack('take', take); }
    forPage(...forPage) { return this._stack('forPage', forPage); }
}
