import {expect} from 'chai';
import sinon from 'sinon';
import Builder from '../src/Eloquent/Builder';

/** @test {Builder} */
describe('Builder', () => {
    let builder; // instance of Builder under test

    let connectionStub;
    let dummyResult;

    let Person; // model class
    let person; // model instance

    beforeEach('builderSetup', () => {
        // Reset dependencies
        Person = class {
            constructor(attr) {
                Object.assign(this, attr || {});
                this.constructor.endpoint = 'api';
            }
            hydrate(results) {
                return results.map(result => new Person(result));
            }
        };
        person = new Person({ id: 5 });
        person.exists = true;

        // Stub out the http calls
        dummyResult = [
            { id: 1, name: "first" },
            { id: 2, name: "second" },
            { id: 3, name: "third" },
        ];
        connectionStub = {
            create: sinon.stub().resolves(),
            read: sinon.stub().resolves(dummyResult),
            update: sinon.stub().resolves(),
            delete: sinon.stub().resolves(true)
        };

        // New up the builder
        builder = new Builder(connectionStub);
        builder._setModel(person);
    });

    describe('sugar for finding models by primary key', () => {

        beforeEach(() => person.getKeyName = sinon.stub().returns('KEYNAME'));

        /** @test {Builder#find} */
        it('can fetch a single model from :endpoint/:id', () => {
            let result = new Person();
            connectionStub.read.resolves({ some: 'data' });
            person.newInstance = sinon.stub().returns(result);

            let request = builder.find(2);

            expect(connectionStub.read).to.have.been.calledWith(2);
            return request.then(found => {
                expect(person.newInstance).to.have.been.calledWith({ some: 'data' });
                expect(found).to.equal(result);
            });
        })

        /** @test {Builder#find} */
        it('defers to findMany() if an array is given to find()', function() {
            sinon.stub(builder, 'findMany').resolves('FOUND MANY');

            return expect(builder.find([1, 2])).to.eventually.equal('FOUND MANY');
        });

        /** @test {Builder#findMany} */
        it('can fetch multiple models using whereIn', () => {
            sinon.stub(builder, 'whereIn').returnsThis();

            builder.findMany([1, 2, 3]);

            expect(builder.whereIn).to.have.been.calledWith('KEYNAME', [1, 2, 3]);
        });

        /** @test {Builder#findOrFail} */
        it('throws if no model was found', () => {
            connectionStub.read.resolves();

            return expect(builder.findOrFail(1)).to.eventually.be.rejectedWith('ModelNotFoundException');
        });
    });

    /** @test {Builder#first} */
    it('gets the first result from the current query', () => {
        return expect(builder.first()).to.eventually.be.an.instanceOf(Person);
    });

    /** @test {Builder#firstOrFail} */
    it('gets the first result, or throws if no results', () => {
        connectionStub.read.resolves([]);

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

    /** @test {Builder#_setModel} */
    /** @test {Builder#_getModel} */
    describe('underling model instance', () => {
        it('has a setter and getter', () => {
            let differentModel = Object.assign({}, person, { iAm: 'different' });

            builder._setModel(differentModel);

            expect(builder._getModel()).to.equal(differentModel);
        });

        it('is the source of scope methods copied to the builder', () => {
            sinon.spy(builder, 'scope');
            person.constructor.scopes = ['ofBreed', 'living'];
            builder._setModel(person);

            builder.ofBreed('terrier').living();

            expect(builder.scope).to.have.been.calledTwice;
        });

        it('hydrates data returned from a SELECT query', () => {
            return expect(builder.get()).to.eventually.eql(dummyResult.map((row) => new Person(row)));
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

    describe('query execution', () => {
        /** @test {Builder#get} */
        it('defers to connection.read for SELECT queries', function () {
            builder.where('archived', 0).get();
            expect(connectionStub.read).to.have.been.calledWith([["where", ["archived", 0]]]);
        });

        /** @test {Builder#insert} */
        it('defers to connection.create for INSERT queries', () => {
            let attributes = { name: 'Frank' };
            builder.insert(attributes);
            expect(connectionStub.create).to.have.been.calledWith(attributes);
        });

        /** @test {Builder#update} */
        it('defers to connection.update for UPDATE queries', () => {
            builder.where('name', 'Francis').update({ active: 0 });
            expect(connectionStub.update).to.have.been.calledWith(builder.stack, { active: 0 });
        });

        /** @test {Builder#delete} */
        it('defers to connection.update for DELETE queries', () => {
            builder.where('name', 'Francis').delete();
            expect(connectionStub.delete).to.have.been.calledWith(builder.stack);
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
            'with',
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
