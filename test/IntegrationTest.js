import {expect} from 'chai';
import Eloquent from '../src/index';
import Model from '../src/Eloquent/Model';
import mock from './helpers/mockServer';

/*
 * Note: these tests rely on the global state of the Eloquent function object.
 */
describe('default export', () => {

    context('factory', () => {
        it('defines a model', () => {
            Eloquent('Post', { endpoint: 'api/posts' });
        });

        it('returns a previously defined model', () => {
            let Post = Eloquent('Post');
            expect(new Post()).to.be.an.instanceOf(Model);
            expect(Post.endpoint).to.equal('api/posts');
        });

        it('attaches model definitions to itself', () => {
            expect(Eloquent.Post).to.equal(Eloquent('Post'));
        });

        it('makes models independent of each other', () => {
            Eloquent('Comment', {});
            expect(Eloquent.Comment.endpoint).to.be.undefined;
        });

        it('boots each model', () => {
            expect(Eloquent.Post.where).to.be.a.function;
            expect(Eloquent.Comment.where).to.be.a.function;
        });
    });

    context('api', () => {
        let Dog;

        Eloquent('Dog', { endpoint: mock.url('api/dogs') });

        beforeEach('setup model', function() {
            Dog = Eloquent('Dog');
        });

        it('fetches a record by ID', () => {
            mock({ id: 1 }, 'api/dogs/1');

            return Dog.find(1).then(dog => {
                expect(dog).to.be.an.instanceOf(Dog);
                expect(dog.id).to.equal(1);
            });
        });

        it('returns a collection of hydrated models', () => {
            mock([{ id: 1 }, { id: 2 }], 'api/dogs');

            return Dog.all().then(dogs => {
                dogs.forEach(dog => expect(dog).to.be.an.instanceOf(Dog));
                expect(dogs.length).to.equal(2);
            });
        });

        it('applies the current JSON-encoded query to the endpoint URL', () => {
            mock([{ id: 2 }], req => /^\/api\/dogs\?query=/.test(req.url));

            return Dog.where('id', '>', 1).first().then(dog => {
                expect(dog.id).to.equal(2);
            });
        });

        it('lists a given column', () => {
            mock([{ id: 5, age: 52 }, { id: 6, age: 55 }]);

            return expect(Dog.lists('age')).to.eventually.eql([52, 55]);
        });

        it('updates a model', function() {
            mock({ id: 1, name: 'Buster' }, { GET: 'api/dogs/1' });

            return Dog.find(1).then(dog => {

                mock({ name: 'Bob' }, { PUT: 'api/dogs/1' });

                return dog.update({ name: 'Bob' }).then(success => {
                    expect(dog.name).to.equal('Bob');
                });
            });
        });

        it('deletes a model', function() {
            mock({ id: 1, name: 'Buster' }, { GET: 'api/dogs/1' });

            return Dog.find(1).then(dog => {

                mock({}, { DELETE: 'api/dogs/1' });

                expect(dog.exists).to.be.true;

                return dog.delete().then(success => {
                    expect(dog.exists).to.be.false;
                });
            });
        });
    });
});
