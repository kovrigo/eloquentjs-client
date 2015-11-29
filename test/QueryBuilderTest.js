import {expect} from 'chai';
import sinon from 'sinon';
import QueryBuilder from '../src/Query/Builder';
import Transport from '../src/Query/Transport';

/** @test {QueryBuilder} */
describe('QueryBuilder', function () {

    let query;

    beforeEach(function () {
        query = new QueryBuilder(new Transport());
    });

    describe('constructor', function () {
        /** @test {QueryBuilder} */
        it('throws if not passed a Transport', function () {
            expect(() => new QueryBuilder()).to.throw();
            expect(() => new QueryBuilder('rah')).to.throw();
        });
    });

    /** @test {QueryBuilder#from} */
    describe('from()', function () {
        it('sets the endpoint for executing the query', function () {
            query.from('/api/posts');
            expect(query.endpoint).to.equal('/api/posts');
        });
    });

    /** @test {QueryBuilder#get} */
    describe('get()', function () {
        it('throws if no endpoint is set', function () {
            expect(() => query.get()).to.throw(Error);
        });
        it('calls the transporter with the endpoint and query stack', function () {
            query.transport.get = sinon.spy();

            query.from('/api/posts').where('archived', 0).get();

            expect(query.transport.get).to.have.been.calledWith('/api/posts', [["where", ["archived", 0]]]);
        });
    });

    // These methods have no implementation beyond simply
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
                let testArgs = getTestArgs(method);

                query[method].apply(query, testArgs);

                expect(query.stack.pop()).to.eql([method, testArgs]);
            });

            it('is chainable', function () {
                expect(query[method]()).to.equal(query);
            });
        });
    });

    describe('insert()', function () {
        it('uses transport to POST the given attributes to the endpoint', function () {
            let attributes = { name: 'Frank' };
            sinon.spy(query.transport, 'post');
            query.from('api/people').insert(attributes);
            expect(query.transport.post).to.have.been.calledWith('api/people', attributes);
        });
    });

    describe('update()', function() {
        it('uses transport to make a PUT request to a faked RESTful URL', function () {
            sinon.spy(query.transport, 'put');
            query.from('api/people').update({ active: 0 });
            expect(query.transport.put).to.have.been.calledWith('api/people/*', { active: 0 });
        });
        it('also passes the query stack to the transport', function () {
            sinon.spy(query.transport, 'put');
            query.from('api/people').where('name', 'Francis').update({});
            expect(query.transport.put).to.have.been.calledWith('api/people/*', {}, query.stack);
        });
    });
});

function getTestArgs(method)
{
    switch (method) {
        case 'distinct':
        case 'oldest':
        case 'latest':
            return [];

        case 'offset':
        case 'skip':
        case 'limit':
        case 'take':
            return [5];

        default:
            return ['test', 'arguments'];
    }
}
