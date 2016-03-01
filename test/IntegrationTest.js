import Eloquent from '../src/index';
import Model from '../src/Eloquent/Model';
import fetchMock from 'fetch-mock/src/server';
import {expect} from 'chai';

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

    context('related', () => {
        it('replaces named relations with factories', function () {
            Eloquent('Monkey', {
                relations: {
                    posts: 'Post',
                    comments: 'Comment'
                }
            });
            expect(Eloquent.Monkey.relations.posts()).to.equal(Eloquent.Post);
            expect(Eloquent.Monkey.relations.comments()).to.equal(Eloquent.Comment);
        });
    });

    context('api', () => {
        let Dog;

        Eloquent('Dog', { endpoint: 'api/dogs' });

        beforeEach('setup model', () => Dog = Eloquent('Dog'));
        afterEach('restore mocks', () => fetchMock.restore());

        it('fetches a record by ID', () => {
            fetchMock.mock('api/dogs/1', 'get', { id: 1 });

            return Dog.find(1).then(dog => {
                expect(dog).to.be.an.instanceOf(Dog);
                expect(dog.id).to.equal(1);
            });
        });

        it('returns a collection of hydrated models', () => {
            fetchMock.mock('api/dogs', 'get', [{ id: 1 }, { id: 2 }]);

            return Dog.all().then(dogs => {
                dogs.forEach(dog => expect(dog).to.be.an.instanceOf(Dog));
                expect(dogs.length).to.equal(2);
            });
        });

        it('applies the current JSON-encoded query to the endpoint URL', () => {
            fetchMock.mock('^api/dogs?query=', 'get', [{ id: 5 }]);

            return Dog.where('id', '>', 1).first().then(dog => {
                expect(dog.id).to.equal(5);
            });
        });

        it('lists a given column', () => {
            fetchMock.mock('^api/dogs?query=', 'get', [{ id: 5, age: 52 }, { id: 6, age: 55 }]);

            return expect(Dog.lists('age')).to.eventually.eql([52, 55]);
        });
    });
});
