import {expect} from 'chai';
import sinon from 'sinon';
import EloquentBuilder from '../src/Eloquent/Builder';
import Model from '../src/Eloquent/Model';

/** @test {EloquentBuilder} */
describe('EloquentBuilder', () => {

    let builder; // instance of EloquentBuilder under test

    let transportStub;
    let dummyResult;

    let Person; // model class
    let person; // model instance

    beforeEach('builderSetup', () => {
        // Reset dependencies
        Person = class extends Model {};
        Person.endpoint = 'api';
        person = new Person({ id: 5 });
        person.exists = true;

        // Stub out the http calls
        dummyResult = [
            { id: 1, name: "first" },
            { id: 2, name: "second" },
            { id: 3, name: "third" },
        ];
        transportStub = {
            get: sinon.stub().resolves(dummyResult),
            post: sinon.stub().resolves(),
            put: sinon.stub().resolves(),
            delete: sinon.stub().resolves(true)
        };

        // New up the builder
        builder = new EloquentBuilder(transportStub);
        builder._setModel(person);
    });

    describe('sugar for finding models by primary key', () => {

        /** @test {EloquentBuilder#find} */
        it('can fetch a single model from :endpoint/:id');

        /** @test {EloquentBuilder#findMany} */
        it('can fetch multiple models using whereIn', () => {
            sinon.stub(builder, 'whereIn').returnsThis();

            builder.findMany([1, 2, 3]);

            expect(builder.whereIn).to.have.been.calledWith(person.primaryKey, [1, 2, 3]);
        });

        /** @test {EloquentBuilder#findOrFail} */
        it('throws if no model was found', () => {
            transportStub.get.resolves([]);

            return expect(builder.findOrFail(1)).to.eventually.be.rejectedWith('ModelNotFoundException');
        });

    });

    /** @test {EloquentBuilder#first} */
    it('gets the first result from the current query', () => {
        return expect(builder.first()).to.eventually.eql(dummyResult[0]);
    });

    /** @test {EloquentBuilder#firstOrFail} */
    it('gets the first result, or throws if no results', () => {
        transportStub.get.resolves([]);

        return expect(builder.firstOrFail()).to.eventually.be.rejectedWith('ModelNotFoundException');
    });

    context('when you want a partial result', () => {

        /** @test {EloquentBuilder#value} */
        it('can get a single column\'s value from the first row', () => {
            return expect(builder.value('name')).to.eventually.equal('first');
        });

        /** @test {EloquentBuilder#lists} */
        it('can get an array of values from a column', () => {
            return expect(builder.lists('name')).to.eventually.eql(['first', 'second', 'third']);
        });

    });

    xdescribe('with()', function () { // no server-side support yet
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

    /** @test {EloquentBuilder#_setModel} */
    /** @test {EloquentBuilder#_getModel} */
    describe('underling model instance', () => {

        it('has a setter and getter', () => {
            let differentModel = new (class extends Model {});

            builder._setModel(differentModel);

            expect(builder._getModel()).to.equal(differentModel);
        });

        it('provides the query builder with its endpoint', () => {
            expect(builder.endpoint).to.equal(Person.endpoint);
        });

        it('is the source of scope methods copied to the builder', () => {
            Person.scopes = ['ofBreed', 'living'];
            sinon.spy(builder, 'scope');
            builder._setModel(new Person());

            builder.ofBreed('terrier').living();

            expect(builder.scope).to.have.been.calledTwice;
        });
    });

    /** @test {EloquentBuilder#scope} */
    describe('scope()', () => {

        it('tracks calls to dynamic scope methods', () => {
            builder.scope('ofType', ['admin']);

            expect(builder.stack.pop()).to.eql(['scope', ['ofType', ['admin']]]);
        });

        it('is chainable', () => {
            expect(builder.scope('ofType', ['admin'])).to.equal(builder);
        });

    });

    describe('query execution', () => {

        /** @test {EloquentBuilder#get} */
        it('fetches results as hydrated models', () => {
            return expect(builder.get()).to.eventually.eql(dummyResult.map((row) => new Person(row)));
        });

        /** @test {EloquentBuilder#update} */
        it('sends update data to a RESTful endpoint', function() {
            builder._setModel(new Person({ id: 6 }));

            builder.update({ name: 'Ann' });

            expect(transportStub.put).to.have.been.calledWith('api/6');
        });

        /** @test {EloquentBuilder#delete} */
        it('sends a delete call to a RESTful endpoint', function() {
            builder._setModel(new Person({ id: 6 }));

            builder.delete();

            expect(transportStub.delete).to.have.been.calledWith('api/6');
        });

    });
});
