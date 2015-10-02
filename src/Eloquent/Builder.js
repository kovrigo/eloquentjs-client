//import QueryBuilder from '../Query/Builder';

/**
 * EloquentBuilder
 *
 * Extends the Query Builder with Eloquent specific
 * functionality, such as find(), has(), with(),
 * lists(), value(), etc.
 */
export default class Builder {

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



/*
 int update(array $values)
 Update a record in the database.

 int increment(string $column, int $amount = 1, array $extra = array())
 Increment a column's value by a given amount.

 int decrement(string $column, int $amount = 1, array $extra = array())
 Decrement a column's value by a given amount.

 mixed delete()
 Delete a record from the database.

 mixed forceDelete()
 Run the default delete function on the builder.


 Builder|Builder has(string $relation, string $operator = '>=', int $count = 1, string $boolean = 'and', Closure $callback = null)
 Add a relationship count condition to the query.

 Builder|Builder doesntHave(string $relation, string $boolean = 'and', Closure $callback = null)
 Add a relationship count condition to the query.

 Builder|Builder orHas(string $relation, string $operator = '>=', int $count = 1)
 Add a relationship count condition to the query with an "or".


 mixed __call(string $method, array $parameters)
 Dynamically handle calls into the query instance.

 void __clone()
 Force a clone of the underlying query builder when cloning.

 Eloquent({
 endpoint: 'posts'
 })
 Eloquent('Post') // Model

 Eloquent.define('Post', {

 });

 Post.where('published', false).get();

 */
