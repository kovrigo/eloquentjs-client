import {expect} from 'chai';
import sinon from 'sinon';
import EloquentBuilder from '../src/Eloquent/Builder';

/** @test {EloquentBuilder} */
describe('EloquentBuilder', function () {

    let builder;
    let transport;
    let rows;
    let row = function (id, label) { return { id, label }; };

    beforeEach(function () {
        rows = [row(1, 'first'), row(2, 'second'), row(3, 'third')];
        transport = {
            get: sinon.stub().resolves(rows)
        };
        builder = new EloquentBuilder(transport);
        builder.from('api/posts');
    });

    /** @test {EloquentBuilder#find} */
    it('finds a model by its primary key', function () {
        return builder.find(1).then(function (result) {
            expect(result).to.equal(rows[0]);
        });
    });

    /** @test {EloquentBuilder#findMany} */
    it('finds many models by primary key', function () {
        return builder.findMany([1, 2, 3]).then(function (result) {
            expect(result).to.equal(rows);
        });
    });

    describe('findOrFail()', function () {
        /** @test {EloquentBuilder#findOrFail} */
        it('throws if no model was found', function () {
            transport.get.resolves([]);
            return expect(builder.findOrFail(1)).to.eventually.be.rejectedWith('ModelNotFoundException');
        });
    });

    /** @test {EloquentBuilder#first} */
    it('executes the query and gets the first result', function () {
        return expect(builder.first()).to.eventually.equal(rows[0]);
    });

    describe('firstOrFail()', function () {
        /** @test {EloquentBuilder#firstOrFail} */
        it('throws if no model was found', function () {
            transport.get.resolves([]);
            return expect(builder.firstOrFail()).to.eventually.be.rejectedWith('ModelNotFoundException');
        });
    });

    describe('pluck()', function () {
        /** @test {EloquentBuilder#pluck} */
        it('gets a single column\'s value from the first result of a query', function () {
            return expect(builder.value('label')).to.eventually.equal('first');
        });
    });

    describe('value()', function () {
        /** @test {EloquentBuilder#value} */
        it('is an alias for pluck()', function () {
            return expect(builder.pluck('label')).to.eventually.equal('first');
        });
    });

    describe('lists()', function () {
        /** @test {EloquentBuilder#lists} */
        it('gets an array with the values of a given column', function () {
            return expect(builder.lists('label')).to.eventually.eql(['first', 'second', 'third']);
        });
    });

    describe('with()', function () {
        /** @test {EloquentBuilder#with} */
        it('sets the relationships that should be eager loaded', function () {
            builder.with('comments');
            expect(builder.stack[0]).to.eql(['with', ['comments']]);
        });
        /** @test {EloquentBuilder#with} */
        it('returns the EloquentBuilder, not the base QueryBuilder', function () {
            expect(builder.with('comments')).to.equal(builder);
        });
    });

    describe('model instance being queried', function () {
        it('has a getter that throws if not set', function () {
            expect(() => builder.model).to.throw();
        });

        it('has a setter', function () {
            let model = {};
            builder.model = model;
            expect(builder.model).to.equal(model);
        });

        it('provides the query builder with its endpoint', function () {
            builder.model = { endpoint: 'myApi' };
            expect(builder.endpoint).to.equal('myApi');
        });
    });
});
