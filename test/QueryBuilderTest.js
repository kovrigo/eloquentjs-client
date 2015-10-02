import {expect} from 'chai';
import sinon from 'sinon';
import Query from '../src/Query/Builder';
import Transport from '../src/Query/Transport';

describe('QueryBuilder', function () {

    let query;

    beforeEach(function () {
        query = new Query(new Transport());
    });

    describe('from()', function () {
        it('sets the endpoint for executing the query', function () {
            query.from('/api/posts');
            expect(query.endpoint).to.equal('/api/posts');
        });
    });

    describe('get()', function () {
        it('throws if no endpoint is set', function () {
            expect(query.get).to.throw(Error);
        });
        it('throws if no transport is set', function () {
            expect(new Query().from('/api/posts').get).to.throw(Error);
        });
        it('calls the transporter with the endpoint and query stack', function () {
            query.transport.get = sinon.spy();

            query.from('/api/posts').get();

            expect(query.transport.get).to.have.been.calledWith('/api/posts');
        });
    });

    // The remaining methods have no implementation beyond simply
    // tracking the order of their calls and their arguments.
    let methods = [
        'select', 'addSelect',
        'distinct',
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
                let testArgs = ['test', 'arguments'];

                query[method].apply(query, testArgs);

                expect(query.stack.pop()).to.eql([method, testArgs]);
            });

            it('is chainable', function () {
                expect(query[method]()).to.equal(query);
            });
        });
    });

});
