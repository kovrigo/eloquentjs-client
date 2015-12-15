import {expect} from 'chai';
import sinon from 'sinon';
import Model from '../src/Eloquent/Model';
import { app } from '../src/index';

/** @test {Model} */
describe('Model', () => {

    let Person; // the "class"
    let person; // an instance of Person
    let attributes; // dummy data for the person
    let builderStub; // stub for common dependency
    let BuilderClass = class {
        _setModel() {
            return sinon.stub();
        }
    };

    // Reset the stubs, data, Person class, and person instance
    beforeEach('modelSetup', () => {
        builderStub = new BuilderClass();
        app.register('Builder', builderStub);

        attributes = {
            name: 'Dave',
            email: 'dave@example.com'
        };

        Person = class extends Model {};
        person = new Person(attributes);
        person.exists = true;
    });

    context('data', () => {
        it('is made available as public properties', () => {
            expect(person.name).to.equal('Dave');
        });

        /** @test {Model#getAttributes} */
        it('can be retreived as plain object ', () => {
            expect(person.getAttributes()).to.eql(attributes)
        });

        /** @test {Model#setAttributes} */
        it('can be changed', () => {
            person.setAttribute('name', 'Dorothy');
            expect(person.name).to.equal('Dorothy');

            person.name = 'Doris';
            expect(person.getAttribute('name')).to.equal('Doris');
        });

        /** @test {Model#getDirty} */
        it('tracks any changes', () => {
            person.name = 'Donna';
            expect(person.getDirty()).to.eql({
                name: 'Donna'
            });
        });

        context('when the column is a date', () => {

            beforeEach('setupPersonWithTimestamp', () => {
                person = new Person({ created_at: '2015-11-23T12:11:03+0000' });
            })

            it('is cast to a Date object', () => {
                expect(person.created_at).to.be.an.instanceOf(Date);
            });

            it('can be configured at run-time on the class object', () => {
                let Dog = class extends Model {};
                Dog.dates = ['birthday'];

                let buster = new Dog({ birthday: '2015-11-23T12:11:03+0000' });

                expect(buster.birthday).to.be.an.instanceOf(Date);
            });

            it('is cloned', () => {
                person.created_at.setFullYear(1999);
                expect(person.created_at).not.to.equal(person.original.created_at);
            });

            it('is cast to a UNIX timestamp when converted to JSON', () => {
                let asJSON = JSON.stringify(person);
                expect(JSON.parse(asJSON).created_at).to.be.a('number');
            });
        });

        /** @test {Model#fill} */
        it('fills the model from an attributes object', () => {
            person.fill({ name: 'Bob' });
            expect(person.name).to.equal('Bob');
        });
    });

    describe('query builder', () => {

        let setModelStub;

        beforeEach('stubSetModel', () => {
            setModelStub = sinon.stub();
            Object.getPrototypeOf(builderStub)._setModel = setModelStub;
        });

        /** @test {Model#newQuery} */
        it('can be created from a model instance', () => {
            expect(person.newQuery()).to.equal(builderStub);
            expect(builderStub._setModel).to.have.been.calledWith(person);
        });

        /** @test {Model#query} */
        it('can be created from a model class (statically)', () => {
            expect(Person.query()).to.equal(builderStub);
            expect(builderStub._setModel.args[0][0]).to.be.an.instanceOf(Person);
        });

        it('has its methods proxied at boot', () => {
            Object.getPrototypeOf(builderStub).anyBuilderMethod = sinon.stub().returnsThis();
            Model._bootBaseModel();

            // static access
            expect(Person.anyBuilderMethod('test', 'args')).to.equal(builderStub);
            expect(builderStub.anyBuilderMethod).to.have.been.calledWith('test', 'args');

            // instance access
            expect(person.anyBuilderMethod('test', 'args')).to.equal(builderStub);
            expect(builderStub.anyBuilderMethod).to.have.been.calledWith('test', 'args');
        });
    });

    /** @test {Model#hydrate} */
    describe('hydrate()', () => {
        it('creates an array of models from an array of plain objects', () => {
            let person1 = attributes;
            let person2 = { name: 'Donald', email: 'donald@example.com' };

            let hydrated = person.hydrate([person1, person2]);

            expect(hydrated).to.have.length(2);
            expect(hydrated[0]).to.be.an.instanceOf(Person);
            expect(hydrated[1]).to.be.an.instanceOf(Person);
            expect(hydrated[0].name).to.equal('Dave');
            expect(hydrated[1].name).to.equal('Donald');
        });
    });

    /** @test {Model#all} */
    describe('all()', () => {
        it('fetches all models', () => {
            builderStub.get = sinon.stub().returns('ALL');
            expect(Person.all()).to.equal('ALL');
        });
    });

    /** @test {Model#boot} */
    describe('boot()', function () {
        let Dog;

        it('is called once per model', function () {
            Dog = class extends Model {};
            let spy = sinon.spy(Dog, 'boot');
            new Dog();
            new Dog();
            expect(spy).to.have.been.calledOnce;
        });

        describe('scoped method', () => {

            beforeEach('setupModelWithScopes', () => {
                Dog = class extends Model {};
                Dog.scopes = ['ofBreed'];
                Dog.boot();
                builderStub.scope = sinon.stub().returnsThis();
            });

            it('is added to the class', () => {
                expect(Dog.ofBreed).to.be.a('function');
            });

            it('is added to the prototype', () => {
                let rover = new Dog({ name: 'rover' });
                expect(rover.ofBreed).to.be.a('function');
            });

            it('returns a builder object', () => {
                expect(Dog.ofBreed('terrier')).to.equal(builderStub);
            });

            it('calls scope() on the builder', () => {
                Dog.ofBreed('terrier');
                expect(builderStub.scope).to.have.been.calledWith('ofBreed', ['terrier']);
            });
        });
    });

    /** @test {Model#create} */
    describe('create()', () => {
        it('news up an instance with the given attributes and saves it', () => {
            let stub = sinon.stub(Person.prototype, 'save').resolves();

            let saveRequest = Person.create({ name: 'Flibble' });

            expect(stub).to.have.been.called;
            return expect(saveRequest).to.eventually.be.an.instanceOf(Person);
        });
    });

    /** @test {Model#save} */
    describe('save()', () => {

        context('on a non-existent model', () => {

            beforeEach('stubInsert', () => {
                builderStub.insert = sinon.stub().resolves(attributes);
                person.exists = false;
            });

            it('calls insert() on the query builder', () => {
                person.save();
                expect(builderStub.insert).to.have.been.calledWith(person.getAttributes());
            });

            it('updates the instance with the new attributes from the server', () => {
                builderStub.insert.resolves(Object.assign(attributes, { id: 2 }));
                return person.save().then(() => expect(person.id).to.equal(2));
            });
        });

        context('on an existing model', () => {

            beforeEach('stubUpdate', () => {
                builderStub.update = sinon.stub().resolves({ serverSays: 'Hello' });
            });

            it('calls update() on the query builder', () => {
                person.save();
                expect(builderStub.update).to.have.been.calledWith(person.getDirty());
            });

            it('updates the instance with the new attributes from the server', () => {
                return person.save().then(() => expect(person.serverSays).to.equal('Hello'));
            });
        });
    });

    /** @test {Model#update} */
    it('updates the model attributes and saves it', () => {
        sinon.stub(person, 'save');

        person.update({ name: 'Delia' });

        expect(person.save).to.have.been.called;
        expect(person.name).to.equal('Delia');
    });

    /** @test {Model#delete} */
    it('deletes the model', () => {
        person.id = 5;
        builderStub.where = sinon.stub().returnsThis();
        builderStub.delete = sinon.stub().resolves(true);

        return person.delete().then(response => {
            expect(person.exists).to.equal(false);
            expect(builderStub.where).to.have.been.calledWith('id', 5);
            expect(builderStub.delete).to.have.been.called;
        });
    });

    describe('eventing', () => {
        let eventNames = [
            'creating', 'created', 'updating', 'updated',
            'saving', 'saved', 'deleting', 'deleted'
        ];
        let observer;

        eventNames.forEach(observable => {
            it(`registers a ${observable} event handler`, () => {
                let handler = function () {};
                Person[observable](handler);
                expect(Person.events[observable]).to.contain(handler);
            });
        })

        beforeEach('stubBuilderOperations', () => {
            observer = sinon.stub();
            builderStub.insert = sinon.stub().resolves();
            builderStub.update = sinon.stub().resolves();
            builderStub.delete = sinon.stub().resolves();
        });

        it('can have any number of observers', () => {
            let observer2 = sinon.spy();
            Person.creating(observer);
            Person.creating(observer2);

            Person.create({ name: 'Dave' });

            expect(observer).to.have.been.called.once;
            expect(observer2).to.have.been.called.once;
        });

        context('when a new model is created', () => {

            it('fires the creating event beforehand', () => {
                Person.creating(observer);

                Person.create({ name: 'Dave' });

                expect(observer).to.have.been.called;
                expect(observer.args[0][0]).to.be.an.instanceOf(Person);
            });

            it('cancels the creation if event handler returns false', () => {
                observer.returns(false);
                Person.creating(observer);

                let request = Person.create({ name: 'Dave' });

                expect(builderStub.insert).not.to.have.been.called;
                return expect(request).to.eventually.be.rejectedWith('cancelled');
            });

            it('fires the created event afterwards', () => {
                Person.created(observer);

                let request = Person.create({ name: 'Dave' });

                expect(observer).not.to.have.been.called; // yet
                return request.then(person => {
                    expect(person.exists).to.be.true;
                    expect(observer).to.have.been.called.once;
                    expect(observer.args[0][0]).to.be.an.instanceOf(Person);
                })
            });
        });

        context('whenever a model is saved', () => {

            it('fires the saving event beforehand', () => {
                let person = new Person({ name: 'Dave' });
                Person.saving(observer);

                person.save();

                expect(observer).to.have.been.called;
                expect(observer.args[0][0]).to.equal(person);
                expect(observer.args[0][0].exists).to.equal(false);
            });

            it('fires the saved event afterwards', () => {
                let person = new Person({ name: 'Dave' });
                Person.saved(observer);

                return person.save().then(success => {
                    expect(observer).to.have.been.called;
                    expect(observer.args[0][0]).to.equal(person);
                    expect(observer.args[0][0].exists).to.equal(true);
                })
            });

        });

        context('when a model is updated', () => {

            it('fires the updating event beforehand', () => {
                Person.updating(observer);

                person.update({ name: 'Not Dave' });

                expect(observer).to.have.been.called;
                expect(observer.args[0][0]).to.equal(person);
            });

            it('fires the updated event afterwards', () => {
                Person.updated(observer);

                return person.update({ name: 'Not Dave' }).then(success => {
                    expect(observer).to.have.been.called;
                    expect(observer.args[0][0]).to.equal(person);
                    expect(observer.args[0][0].exists).to.equal(true);
                })
            });
        });

        context('when a model is deleted', () => {

            beforeEach('stubWhereForDeleteClause', () => builderStub.where = sinon.stub().returnsThis());

            it('fires the deleting event beforehand', () => {
                Person.deleting(observer);

                person.delete();

                expect(observer).to.have.been.called;
                expect(observer.args[0][0]).to.equal(person);
            });

            it('fires the deleted event afterwards', () => {
                Person.deleted(observer);
                builderStub.delete.resolves(true);

                return person.delete().then(success => {
                    expect(observer).to.have.been.called;
                    expect(observer.args[0][0]).to.equal(person);
                    expect(observer.args[0][0].exists).to.equal(false);
                })
            });
        });
    });

    describe('relationships', () => {
        /** @test {Model#load} */
        describe('eager loading', () => {
            let Comment;
            let Profile;

            beforeEach('eagerLoadStubs', () => {
                // Register a relation on the class
                Person.relations = { comments: 'Comment', profile: 'Profile' };

                // Create the related models in the container
                Comment = class extends Model {};
                Profile = class extends Model {};
                app.register('Comment', Comment);
                app.register('Profile', Profile);
                app.resolving('Comment', Model => Model);
                app.resolving('Profile', Model => Model);

                // Stub the query builder dependencies
                builderStub.with = sinon.stub().returnsThis();
                builderStub.get = sinon.stub().resolves({
                    name: 'Dave',
                    comments: [
                        { body: 'Hello' }
                    ],
                    profile: {
                        website: 'URL'
                    }
                });
            });

            it('uses with() to fetch the model and the requested relations', () => {
                person.load('comments');

                expect(builderStub.with.args[0][0]).to.contain('comments');
                expect(builderStub.get).to.have.been.called;
            });

            it('resolves with the original model', () => {
                return expect(person.load('comments')).to.eventually.equal(person);
            });

            it('attaches the returned attributes to the model', () => {
                expect(person.comments).not.to.be.ok;
                return person.load('comments').then(person => {
                    expect(person.comments).to.be.ok;
                });
            });

            it('does not clobber dirty attributes', () => {
                let request = person.load('comments');
                person.name = 'I CHANGED';

                return request.then(result => {
                    expect(result.name).to.equal('I CHANGED');
                })
            });

            it('hydrates the correct model for a [*]Many relation', () => {
                return person.load('comments').then(person => {
                    expect(person.comments).to.have.length(1);
                    expect(person.comments[0]).to.be.an.instanceOf(Comment);
                    expect(person.comments[0].body).to.equal('Hello');
                });
            });

            it('hydrates the correct model for a [*]One relation', () => {
                return person.load('profile').then(person => {
                    expect(person.profile).to.be.an.instanceOf(Profile);
                    expect(person.profile.website).to.equal('URL');
                });
            });

            it('can load multiple relations at the same time', () => {
                return person.load('profile', 'comments').then(person => {
                    expect(person.profile).to.be.an.instanceOf(Profile);
                    expect(person.comments).to.have.length(1);
                    expect(person.comments[0]).to.be.an.instanceOf(Comment);
                });
            });
        });

        it('does not include relations in getAttributes / getDirty', () => {
            Person.relations.comments = 'Comment';
            person.name = '';
            person.comments = [{ body: 'first' }];

            expect(person.getDirty()).to.eql({ name: '' });
            expect(person.getAttributes()).not.to.have.key('comments');
        });
    });

});
