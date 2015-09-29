import QueryBuilder from './QueryBuilder';

/**
 * EloquentBuilder
 *
 * Extends the Query Builder with Eloquent specific
 * functionality, such as find(), has(), with(),
 * lists(), value(), etc.
 */
export default class EloquentBuilder extends QueryBuilder {

}

/*
Model|Collection|null find(mixed $id, array $columns = array('*'))
Find a model by its primary key.

Collection findMany(array $ids, array $columns = array('*'))
Find a model by its primary key.

Model|Collection findOrFail(mixed $id, array $columns = array('*'))
Find a model by its primary key or throw an exception.

Model|Builder|null first(array $columns = array('*'))
Execute the query and get the first result.

Model|Builder firstOrFail(array $columns = array('*'))
Execute the query and get the first result or throw an exception.

Collection|Builder[] get(array $columns = array('*'))
Execute the query as a "select" statement.

mixed value(string $column)
Get a single column's value from the first result of a query.

mixed pluck(string $column)
Get a single column's value from the first result of a query.

void chunk(int $count, callable $callback)
Chunk the results of the query.

Collection lists(string $column, string $key = null)
Get an array with the values of a given column.

LengthAwarePaginator paginate(int $perPage = null, array $columns = array('*'), string $pageName = 'page', int|null $page = null)
Paginate the given query.

Paginator simplePaginate(int $perPage = null, array $columns = array('*'), string $pageName = 'page')
Paginate the given query into a simple paginator.

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

void onDelete(Closure $callback)
Register a replacement for the default delete function.

Model[] getModels(array $columns = array('*'))
Get the hydrated models without eager loading.

array eagerLoadRelations(array $models)
Eager load the relationships for the models.

Relation getRelation(string $relation)
Get the relation instance for the given relation name.

$this where(string $column, string $operator = null, mixed $value = null, string $boolean = 'and')
Add a basic where clause to the query.

Builder|Builder orWhere(string $column, string $operator = null, mixed $value = null)
Add an "or where" clause to the query.

Builder|Builder has(string $relation, string $operator = '>=', int $count = 1, string $boolean = 'and', Closure $callback = null)
Add a relationship count condition to the query.

Builder|Builder doesntHave(string $relation, string $boolean = 'and', Closure $callback = null)
Add a relationship count condition to the query.

Builder|Builder whereHas(string $relation, Closure $callback, string $operator = '>=', int $count = 1)
Add a relationship count condition to the query with where clauses.

Builder|Builder whereDoesntHave(string $relation, Closure $callback = null)
Add a relationship count condition to the query with where clauses.

Builder|Builder orHas(string $relation, string $operator = '>=', int $count = 1)
Add a relationship count condition to the query with an "or".

Builder|Builder orWhereHas(string $relation, Closure $callback, string $operator = '>=', int $count = 1)
Add a relationship count condition to the query with where clauses and an "or".

$this with(mixed $relations)
Set the relationships that should be eager loaded.

Builder|Builder getQuery()
Get the underlying query builder instance.

$this setQuery(Builder $query)
Set the underlying query builder instance.

array getEagerLoads()
Get the relationships being eagerly loaded.

$this setEagerLoads(array $eagerLoad)
Set the relationships being eagerly loaded.

Model getModel()
Get the model instance being queried.

$this setModel(Model $model)
Set a model instance for the model being queried.

void macro(string $name, Closure $callback)
Extend the builder with a given callback.

Closure getMacro(string $name)
Get the given macro by name.

mixed __call(string $method, array $parameters)
Dynamically handle calls into the query instance.

void __clone()
Force a clone of the underlying query builder when cloning.
 */