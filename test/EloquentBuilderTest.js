import {expect} from 'chai';
import sinon from 'sinon';
import EloquentBuilder from '../src/Eloquent/Builder';
import Model from '../src/Eloquent/Model';

/** @test {EloquentBuilder} */
describe('EloquentBuilder', function () {

    let builder;
    let transport;
    let model;
    let rows;
    let row = function (id, name) { return { id, name }; };
    class Person extends Model {};

    beforeEach(function () {
        // Create the model associated with this builder
        model = new Person();
        model.endpoint = 'api/posts';

        // Stub out the http call
        rows = [row(1, 'first'), row(2, 'second'), row(3, 'third')];
        transport = {
            get: sinon.stub().resolves(rows)
        };

        // New up the builder
        builder = new EloquentBuilder(transport);
        builder._setModel(model);
    });

    /** @test {EloquentBuilder#find} */
    it('finds a model by its primary key', function () {
        return builder.find(1).then(function (result) {
            expect(result).to.eql(rows[0]);
        });
    });

    /** @test {EloquentBuilder#findMany} */
    it('finds many models by primary key', function () {
        return builder.findMany([1, 2, 3]).then(function (result) {
            expect(result).to.eql(rows);
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
        return expect(builder.first()).to.eventually.eql(rows[0]);
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
            return expect(builder.value('name')).to.eventually.equal('first');
        });
    });

    describe('value()', function () {
        /** @test {EloquentBuilder#value} */
        it('is an alias for pluck()', function () {
            return expect(builder.pluck('name')).to.eventually.equal('first');
        });
    });

    describe('lists()', function () {
        /** @test {EloquentBuilder#lists} */
        it('gets an array with the values of a given column', function () {
            return expect(builder.lists('name')).to.eventually.eql(['first', 'second', 'third']);
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
        /** @test {EloquentBuilder#_setModel} */
        /** @test {EloquentBuilder#_getModel} */
        it('has a setter and getter', function () {
            let model = {};
            builder._setModel(model);
            expect(builder._getModel()).to.equal(model);
        });

        it('provides the query builder with its endpoint', function () {
            builder._setModel({ endpoint: 'myApi' });
            expect(builder.endpoint).to.equal('myApi');
        });
    });

    /** @test {EloquentBuilder#get} */
    describe('get()', function () {
        it('returns hydrated models', function () {
            return expect(builder.get()).to.eventually.eql(rows.map((row) => new Person(row)));
        });
    });
});
