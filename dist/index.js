(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _QueryBuilder = require('./QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

/**
 * EloquentBuilder
 *
 * Extends the Query Builder with Eloquent specific
 * functionality, such as find(), has(), with(),
 * lists(), value(), etc.
 */

var EloquentBuilder = (function () {
  function EloquentBuilder(builder) {
    _classCallCheck(this, EloquentBuilder);
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

  _createClass(EloquentBuilder, [{
    key: 'get',
    value: function get(columns) {}
  }]);

  return EloquentBuilder;
})();

exports['default'] = EloquentBuilder;
module.exports = exports['default'];

},{"./QueryBuilder":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _EloquentBuilder = require('./EloquentBuilder');

var _EloquentBuilder2 = _interopRequireDefault(_EloquentBuilder);

var Model = function Model() {
  _classCallCheck(this, Model);
};

exports['default'] = Model;
module.exports = exports['default'];

},{"./EloquentBuilder":1}],3:[function(require,module,exports){
/**
 * QueryBuilder
 *
 * This provides the same API as Laravel's Query Builder, but
 * contains none of the implementation. We only need to keep
 * track of which methods were called and their arguments.
 *
 * @see API based on https://github.com/laravel/framework/blob/5.1/src/Illuminate/Database/Query/Builder.php
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var QueryBuilder = (function () {
    function QueryBuilder(transport) {
        _classCallCheck(this, QueryBuilder);

        this.transport = transport;
        this.stack = [];
        this.endpoint = null;
    }

    _createClass(QueryBuilder, [{
        key: '_call',
        value: function _call(name, args) {
            this.stack.push([name, args]);
            return this;
        }
    }, {
        key: 'from',
        value: function from(endpoint) {
            this.endpoint = endpoint;
            return this;
        }
    }, {
        key: 'select',
        value: function select() {
            for (var _len = arguments.length, columns = Array(_len), _key = 0; _key < _len; _key++) {
                columns[_key] = arguments[_key];
            }

            return this._call('select', columns);
        }
    }, {
        key: 'addSelect',
        value: function addSelect() {
            for (var _len2 = arguments.length, columns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                columns[_key2] = arguments[_key2];
            }

            return this._call('addSelect', columns);
        }
    }, {
        key: 'distinct',
        value: function distinct() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            return this._call('distinct', args);
        }
    }, {
        key: 'where',
        value: function where() {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            return this._call('where', args);
        }
    }, {
        key: 'orWhere',
        value: function orWhere() {
            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            return this._call('orWhere', args);
        }
    }, {
        key: 'orWhere',
        value: function orWhere() {
            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                args[_key6] = arguments[_key6];
            }

            return this._call('orWhere', args);
        }
    }, {
        key: 'whereBetween',
        value: function whereBetween() {
            for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                args[_key7] = arguments[_key7];
            }

            return this._call('whereBetween', args);
        }
    }, {
        key: 'orWhereBetween',
        value: function orWhereBetween() {
            for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                args[_key8] = arguments[_key8];
            }

            return this._call('orWhereBetween', args);
        }
    }, {
        key: 'whereNotBetween',
        value: function whereNotBetween() {
            for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                args[_key9] = arguments[_key9];
            }

            return this._call('whereNotBetween', args);
        }
    }, {
        key: 'orWhereNotBetween',
        value: function orWhereNotBetween() {
            for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                args[_key10] = arguments[_key10];
            }

            return this._call('orWhereNotBetween', args);
        }
    }, {
        key: 'whereNested',
        value: function whereNested() {
            for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
                args[_key11] = arguments[_key11];
            }

            return this._call('whereNested', args);
        }
    }, {
        key: 'whereExists',
        value: function whereExists() {
            for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                args[_key12] = arguments[_key12];
            }

            return this._call('whereExists', args);
        }
    }, {
        key: 'orWhereExists',
        value: function orWhereExists() {
            for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
                args[_key13] = arguments[_key13];
            }

            return this._call('orWhereExists', args);
        }
    }, {
        key: 'whereNotExists',
        value: function whereNotExists() {
            for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
                args[_key14] = arguments[_key14];
            }

            return this._call('whereNotExists', args);
        }
    }, {
        key: 'orWhereNotExists',
        value: function orWhereNotExists() {
            for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
                args[_key15] = arguments[_key15];
            }

            return this._call('orWhereNotExists', args);
        }
    }, {
        key: 'whereIn',
        value: function whereIn() {
            for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
                args[_key16] = arguments[_key16];
            }

            return this._call('whereIn', args);
        }
    }, {
        key: 'orWhereIn',
        value: function orWhereIn() {
            for (var _len17 = arguments.length, args = Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
                args[_key17] = arguments[_key17];
            }

            return this._call('orWhereIn', args);
        }
    }, {
        key: 'whereNotIn',
        value: function whereNotIn() {
            for (var _len18 = arguments.length, args = Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
                args[_key18] = arguments[_key18];
            }

            return this._call('whereNotIn', args);
        }
    }, {
        key: 'orWhereNotIn',
        value: function orWhereNotIn() {
            for (var _len19 = arguments.length, args = Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
                args[_key19] = arguments[_key19];
            }

            return this._call('orWhereNotIn', args);
        }
    }, {
        key: 'whereNull',
        value: function whereNull() {
            for (var _len20 = arguments.length, args = Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
                args[_key20] = arguments[_key20];
            }

            return this._call('whereNull', args);
        }
    }, {
        key: 'orWhereNull',
        value: function orWhereNull() {
            for (var _len21 = arguments.length, args = Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
                args[_key21] = arguments[_key21];
            }

            return this._call('orWhereNull', args);
        }
    }, {
        key: 'whereNotNull',
        value: function whereNotNull() {
            for (var _len22 = arguments.length, args = Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
                args[_key22] = arguments[_key22];
            }

            return this._call('whereNotNull', args);
        }
    }, {
        key: 'orWhereNotNull',
        value: function orWhereNotNull() {
            for (var _len23 = arguments.length, args = Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
                args[_key23] = arguments[_key23];
            }

            return this._call('orWhereNotNull', args);
        }
    }, {
        key: 'whereDate',
        value: function whereDate() {
            for (var _len24 = arguments.length, args = Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
                args[_key24] = arguments[_key24];
            }

            return this._call('whereDate', args);
        }
    }, {
        key: 'whereDay',
        value: function whereDay() {
            for (var _len25 = arguments.length, args = Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
                args[_key25] = arguments[_key25];
            }

            return this._call('whereDay', args);
        }
    }, {
        key: 'whereMonth',
        value: function whereMonth() {
            for (var _len26 = arguments.length, args = Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
                args[_key26] = arguments[_key26];
            }

            return this._call('whereMonth', args);
        }
    }, {
        key: 'whereYear',
        value: function whereYear() {
            for (var _len27 = arguments.length, args = Array(_len27), _key27 = 0; _key27 < _len27; _key27++) {
                args[_key27] = arguments[_key27];
            }

            return this._call('whereYear', args);
        }
    }, {
        key: 'groupBy',
        value: function groupBy() {
            for (var _len28 = arguments.length, columns = Array(_len28), _key28 = 0; _key28 < _len28; _key28++) {
                columns[_key28] = arguments[_key28];
            }

            return this._call('groupBy', columns);
        }
    }, {
        key: 'having',
        value: function having() {
            for (var _len29 = arguments.length, columns = Array(_len29), _key29 = 0; _key29 < _len29; _key29++) {
                columns[_key29] = arguments[_key29];
            }

            return this._call('having', columns);
        }
    }, {
        key: 'orHaving',
        value: function orHaving() {
            for (var _len30 = arguments.length, columns = Array(_len30), _key30 = 0; _key30 < _len30; _key30++) {
                columns[_key30] = arguments[_key30];
            }

            return this._call('orHaving', columns);
        }
    }, {
        key: 'orderBy',
        value: function orderBy() {
            for (var _len31 = arguments.length, order = Array(_len31), _key31 = 0; _key31 < _len31; _key31++) {
                order[_key31] = arguments[_key31];
            }

            return this._call('orderBy', order);
        }
    }, {
        key: 'latest',
        value: function latest() {
            for (var _len32 = arguments.length, order = Array(_len32), _key32 = 0; _key32 < _len32; _key32++) {
                order[_key32] = arguments[_key32];
            }

            return this._call('latest', order);
        }
    }, {
        key: 'oldest',
        value: function oldest() {
            for (var _len33 = arguments.length, order = Array(_len33), _key33 = 0; _key33 < _len33; _key33++) {
                order[_key33] = arguments[_key33];
            }

            return this._call('oldest', order);
        }
    }, {
        key: 'offset',
        value: function offset() {
            for (var _len34 = arguments.length, _offset = Array(_len34), _key34 = 0; _key34 < _len34; _key34++) {
                _offset[_key34] = arguments[_key34];
            }

            return this._call('offset', _offset);
        }
    }, {
        key: 'skip',
        value: function skip() {
            for (var _len35 = arguments.length, _skip = Array(_len35), _key35 = 0; _key35 < _len35; _key35++) {
                _skip[_key35] = arguments[_key35];
            }

            return this._call('skip', _skip);
        }
    }, {
        key: 'limit',
        value: function limit() {
            for (var _len36 = arguments.length, _limit = Array(_len36), _key36 = 0; _key36 < _len36; _key36++) {
                _limit[_key36] = arguments[_key36];
            }

            return this._call('limit', _limit);
        }
    }, {
        key: 'take',
        value: function take() {
            for (var _len37 = arguments.length, _take = Array(_len37), _key37 = 0; _key37 < _len37; _key37++) {
                _take[_key37] = arguments[_key37];
            }

            return this._call('take', _take);
        }
    }, {
        key: 'forPage',
        value: function forPage() {
            for (var _len38 = arguments.length, _forPage = Array(_len38), _key38 = 0; _key38 < _len38; _key38++) {
                _forPage[_key38] = arguments[_key38];
            }

            return this._call('forPage', _forPage);
        }
    }, {
        key: 'get',
        value: function get(columns) {
            if (columns) {
                this.select(columns);
            }

            if (!this.endpoint) {
                throw new Error('Attempted to execute query without an endpoint.');
            }

            if (!this.transport) {
                throw new Error('Attempted to execute query without a transport.');
            }

            return this.transport.get(this.endpoint, this.stack);
        }
    }, {
        key: 'setTransport',
        value: function setTransport(transport) {
            this.transport = transport;
            return this;
        }
    }]);

    return QueryBuilder;
})();

exports['default'] = QueryBuilder;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

exports['default'] = function () {
    return new _Model2['default']();
};

;
module.exports = exports['default'];

},{"./Model":2}]},{},[4]);
