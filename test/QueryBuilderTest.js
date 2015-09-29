import {expect} from 'chai';
import Builder from '../src/QueryBuilder';

describe('QueryBuilder', function () {

    let methods = [
        'select', 'addSelect',
        'distinct',
        'from',
        'where', 'orWhere',
        'whereBetween', 'orWhereBetween', 'whereNotBetween', 'orWhereNotBetween',
        'whereNested',
        'whereExists', 'orWhereExists', 'whereNotExists', 'orWhereNotExists',
        'whereIn', 'orWhereIn', 'whereNotIn', 'orWhereNotIn',
        'whereNull', 'orWhereNull', 'whereNotNull', 'orWhereNotNull',
        'whereDate', 'whereDay', 'whereMonth', 'whereYear',
        'groupBy',
        'having', 'orHaving',
        'orderBy', 'latest', 'oldest',
        'offset', 'skip', 'limit', 'take', 'forPage',
    ];

    methods.forEach(function (method) {

        describe(method + '()', function () {

            it('adds to the call stack', function () {

                let builder  = new Builder();
                let testArgs = ['test', 'arguments'];

                builder[method].apply(builder, testArgs);

                expect(builder.stack.pop()).to.eql([method, testArgs]);
            });

            it('is chainable', function () {

                let builder  = new Builder();

                let result = builder[method]();

                expect(result).to.equal(builder);
            });

        });

    });

});