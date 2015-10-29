import {expect} from 'chai';
import sinon from 'sinon';
import EloquentBuilder from '../src/Eloquent/Builder';

/** @test {EloquentBuilder} */
describe('EloquentBuilder', function () {

    let builder;
    let queryBuilder;
    let rows;
    let row = function (id, label) { return { id, label }; };

    beforeEach(function () {
        rows = [row(1, 'first'), row(2, 'second'), row(3, 'third')];
        queryBuilder = {
            get: sinon.stub().resolves(rows),
            _call: sinon.stub().returnsThis(),
            limit: sinon.stub().returnsThis(),
            from: sinon.stub().returnsThis()
        };
        builder = new EloquentBuilder(queryBuilder);
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
            queryBuilder.get.resolves([]);
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
            queryBuilder.get.resolves([]);
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
            expect(queryBuilder._call).to.have.been.calledWith('with', ['comments']);
        });
        /** @test {EloquentBuilder#with} */
        it('returns the EloquentBuilder, not the base QueryBuilder', function () {
            expect(builder.with('comments')).to.equal(builder);
        });
    });

    describe('constructor', function () {
        /** @test {EloquentBuilder} */
        it('throws if not passed a QueryBuilder', function () {
            expect(() => new EloquentBuilder()).to.throw();
            expect(() => new EloquentBuilder('rah')).to.throw();
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
            expect(queryBuilder.from).to.have.been.calledWith('myApi');
        });
    });
});
