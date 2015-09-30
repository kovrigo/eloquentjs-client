import QueryBuilder from './QueryBuilder';

/**
 * EloquentBuilder
 *
 * Extends the Query Builder with Eloquent specific
 * functionality, such as find(), has(), with(),
 * lists(), value(), etc.
 */
export default class EloquentBuilder {

    constructor(query) {
        this.query = query;
        this.model = null;
    }

    find(id, columns) {
        if (Array.isArray(id)) {
            return this.findMany(id, columns);
        }
        return this.query._call('find', id).get(columns).then(unwrapFirst);
    }

    findMany(ids, columns) {
        return this.query._call('findMany', ids).get(columns);
    }

    findOrFail(id, columns) {
        return this.find(id, columns).then(throwIfNotFound);
    }

    first(columns) {
        return this.query.limit(1).get(columns).then(unwrapFirst);
    }

    firstOrFail(columns) {
        return this.first(columns).then(throwIfNotFound);
    }

    value(column) {
        return this.first(column).then(function (result) {
            return result[column];
        });
    }

    pluck(column) {
        return this.value(column);
    }

    lists(column) {
        return this.query.get(column).then(function (results) {
            return results.map(function (result) {
                return result[column];
            });
        });
    }

    getModel() {
        return this.model;
    }

    setModel(model) {
        this.model = model;
        return this;
    }

    getQuery() {
        return this.query;
    }

    setQuery(query) {
        this.query = query;
        return this;
    }

    with(...relations) {
        return this.query._call('with', relations);
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
