import {expect} from 'chai';
import sinon from 'sinon';
import EloquentBuilder from '../src/Eloquent/Builder';
import QueryBuilder from '../src/Query/Builder';

/** @test {EloquentBuilder} */
describe('EloquentBuilder', function () {

    let builder;
    let query;
    let rows;
    let row = function (label) { return {label}; };

    beforeEach(function () {
        rows = [row('first'), row('second'), row('third')];
        query = new QueryBuilder();
        builder = new EloquentBuilder(query);
        sinon.stub(query, 'get').resolves(rows);
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
            builder.query.get.resolves([]);
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
            builder.query.get.resolves([]);
            return expect(builder.firstOrFail()).to.eventually.be.rejectedWith('ModelNotFoundException');
        });
    });

    describe('pluck()', function () {
        /** @test {EloquentBuilder#pluck} */
        it('gets a single column\'s value from the first result of a query', function () {
            builder.query.get.resolves([{ id: 1, name: 'Roger' }]);
            return expect(builder.value('name')).to.eventually.equal('Roger');
        });
    });

    describe('value()', function () {
        /** @test {EloquentBuilder#value} */
        it('is an alias for pluck()', function () {
            sinon.stub(builder, 'pluck').resolves('Roger');
            return expect(builder.pluck('name')).to.eventually.equal('Roger');
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
            expect(builder.query.stack).to.eql([['with', ['comments']]]);
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
        it('throws if not set', function () {
            expect(() => builder.model).to.throw();
        });

        it('has a setter', function () {
            let model = sinon.spy();
            builder.model = model;
            expect(builder.model).to.equal(model);
        });
    });
});
