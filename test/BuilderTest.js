import {expect} from 'chai';
import sinon from 'sinon';
import Builder from '../src/Eloquent/Builder';
import Model from '../src/Eloquent/Model';

/** @test {Builder} */
describe('Builder', () => {
    let builder; // instance of Builder under test

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
        builder = new Builder(transportStub);
        builder._setModel(person);
    });

    /** @test {Builder#constructor} */
    it('throws if not passed a Transport', function () {
        expect(() => new Builder()).to.throw();
        expect(() => new Builder('rah')).to.throw();
    });

    describe('sugar for finding models by primary key', () => {
        /** @test {Builder#find} */
        it('can fetch a single model from :endpoint/:id');

        /** @test {Builder#findMany} */
        it('can fetch multiple models using whereIn', () => {
            sinon.stub(builder, 'whereIn').returnsThis();

            builder.findMany([1, 2, 3]);

            expect(builder.whereIn).to.have.been.calledWith(person.primaryKey, [1, 2, 3]);
        });

        /** @test {Builder#findOrFail} */
        it('throws if no model was found', () => {
            transportStub.get.resolves([]);

            return expect(builder.findOrFail(1)).to.eventually.be.rejectedWith('ModelNotFoundException');
        });
    });

    /** @test {Builder#first} */
    it('gets the first result from the current query', () => {
        return expect(builder.first()).to.eventually.eql(dummyResult[0]);
    });

    /** @test {Builder#firstOrFail} */
    it('gets the first result, or throws if no results', () => {
        transportStub.get.resolves([]);

        return expect(builder.firstOrFail()).to.eventually.be.rejectedWith('ModelNotFoundException');
    });

    context('when you want a partial result', () => {
        /** @test {Builder#value} */
        it('can get a single column\'s value from the first row', () => {
            return expect(builder.value('name')).to.eventually.equal('first');
        });

        /** @test {Builder#lists} */
        it('can get an array of values from a column', () => {
            return expect(builder.lists('name')).to.eventually.eql(['first', 'second', 'third']);
        });
    });

    xdescribe('with()', function () { // no server-side support yet
        /** @test {Builder#with} */
        it('sets the relationships that should be eager loaded', function () {
            builder.with('comments');

            expect(builder.stack[0]).to.eql(['with', ['comments']]);
        });
        /** @test {Builder#with} */
        it('returns the Builder, not the base QueryBuilder', function () {
            expect(builder.with('comments')).to.equal(builder);
        });
    });

    /** @test {Builder#_setModel} */
    /** @test {Builder#_getModel} */
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

    /** @test {Builder#scope} */
    describe('scope()', () => {
        it('tracks calls to dynamic scope methods', () => {
            builder.scope('ofType', ['admin']);

            expect(builder.stack.pop()).to.eql(['scope', ['ofType', ['admin']]]);
        });

        it('is chainable', () => {
            expect(builder.scope('ofType', ['admin'])).to.equal(builder);
        });

    });

    /** @test {Builder#from} */
    it('can change the endpoint for executing the query', () => {
        let returnValue = builder.from('/api/posts');

        expect(builder.endpoint).to.equal('/api/posts');
        expect(returnValue).to.equal(builder);
    });

    describe('query execution', () => {
        /** @test {Builder#get} */
        context('for select statements', () => {

            it('throws if no endpoint is set', function () {
                expect(() => new Builder(transportStub).get()).to.throw(Error);
            });

            it('calls the transporter with the endpoint and query stack', function () {
                builder.from('/api/posts').where('archived', 0).get();

                expect(transportStub.get).to.have.been.calledWith('/api/posts', [["where", ["archived", 0]]]);
            });

            it('fetches results as hydrated models', () => {
                return expect(builder.get()).to.eventually.eql(dummyResult.map((row) => new Person(row)));
            });
        });

        it('can insert() to the endpoint', () => {
            let attributes = { name: 'Frank' };

            builder.from('api/people').insert(attributes);

            expect(transportStub.post).to.have.been.calledWith('api/people', attributes);
        });

        context('from an existing model', () => {
            /** @test {Builder#update} */
            it('sends update data to a RESTful endpoint', () => {
                builder._setModel(new Person({ id: 6 }));

                builder.update({ name: 'Ann' });

                expect(transportStub.put).to.have.been.calledWith('api/6');
            });

            /** @test {Builder#delete} */
            it('sends a delete call to a RESTful endpoint', () => {
                builder._setModel(new Person({ id: 6 }));

                builder.delete();

                expect(transportStub.delete).to.have.been.calledWith('api/6');
            });
        });

        context('dynamic', () => {
            beforeEach(() => builder._setModel(new Person()));

            it('sends update data to a faked RESTful URL', () => {
                builder.where('name', 'Francis').update({ active: 0 });

                expect(transportStub.put).to.have.been.calledWith('api/*', { active: 0 }, builder.stack);
            });

            it('sends a DELETE request to a faked RESTful URL', () => {
                builder.where('name', 'Francis').delete();
                expect(builder.transport.delete).to.have.been.calledWith('api/*', builder.stack);
            });
        });
    });

    // These methods have no implementation beyond simply
    // tracking the order of their calls and their arguments.
    context('methods without client-side implementation', () => {
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

        let dummyArgumentsForMethod = (method) => {
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
            }

            return ['test', 'arguments'];
        };

        methods.forEach(method => {
            it(method + '() adds to the call stack and returns self', () => {
                let testArgs = dummyArgumentsForMethod(method);

                let returnValue = builder[method].apply(builder, testArgs);

                expect(returnValue).to.equal(builder);
                expect(builder.stack.pop()).to.eql([method, testArgs]);
            });
        });
    });
});
