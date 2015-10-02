import {expect} from 'chai';
import sinon from 'sinon';
import Eloquent from '../src/Eloquent/Builder';
import Query from '../src/Query/Builder';
import Transport from '../src/Query/Transport';

describe('EloquentBuilder', function () {

    let builder;
    let rows;

    beforeEach(function () {
        rows = [row('first'), row('second'), row('third')];
        builder = new Eloquent(new Query(new Transport()));
        builder.query.from('/api/posts');
        sinon.stub(builder.query, 'get').resolves(rows);
    });

    it('finds a model by its primary key', function () {
        return builder.find(1).then(function (result) {
            expect(result).to.equal(rows[0]);
        });
    });

    it('finds many models by primary key', function () {
        return builder.findMany([1, 2, 3]).then(function (result) {
            expect(result).to.equal(rows);
        });
    });

    describe('findOrFail()', function () {
        it('throws if no model was found', function () {
            builder.query.get.resolves([]);
            return expect(builder.findOrFail(1)).to.eventually.be.rejectedWith('ModelNotFoundException');
        });
    });

    it('executes the query and gets the first result', function () {
        return expect(builder.first()).to.eventually.equal(rows[0]);
    });

    describe('firstOrFail()', function () {
        it('throws if no model was found', function () {
            builder.query.get.resolves([]);
            return expect(builder.firstOrFail()).to.eventually.be.rejectedWith('ModelNotFoundException');
        });
    });

    describe('pluck()', function () {
        it('gets a single column\'s value from the first result of a query', function () {
            builder.query.get.resolves([{ id: 1, name: 'Roger' }]);
            return expect(builder.value('name')).to.eventually.equal('Roger');
        });
    });

    describe('value()', function () {
        it('is an alias for pluck()', function () {
            sinon.stub(builder, 'pluck').resolves('Roger');
            return expect(builder.pluck('name')).to.eventually.equal('Roger');
        });
    });

    describe('lists()', function () {
        it('gets an array with the values of a given column', function () {
            return expect(builder.lists('label')).to.eventually.eql(['first', 'second', 'third']);
        });
    });

    describe('model instance being queried', function () {
        it('has a getter', function () {
            expect(builder.getModel()).to.equal(builder.model);
        });

        it('has a setter', function () {
            let model = {};
            builder.setModel(model);
            expect(builder.model).to.equal(model);
        });
    });

    describe('underlying query builder', function () {
        it('has a getter', function () {
            expect(builder.getQuery()).to.equal(builder.query);
        });

        it('has a setter', function () {
            let query = {};
            builder.setQuery(query);
            expect(builder.query).to.equal(query);
        });
    });

    describe('with()', function () {
        it('sets the relationships that should be eager loaded', function () {
            builder.with('comments');
            expect(builder.query.stack).to.eql([['with', ['comments']]]);
        });
    });
});

function row(label) {
    return { label };
}
