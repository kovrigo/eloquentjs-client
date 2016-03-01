import Eloquent from '../src/index';
import Model from '../src/Eloquent/Model';
import {expect} from 'chai';

/*
 * Note: these tests rely on the global state of the Eloquent function object.
 */
describe('default export', function () {

    it('defines a model', function () {
        Eloquent('Post', { endpoint: 'api/posts' });
    });

    it('returns a previously defined model', function () {
        let Post = Eloquent('Post');
        expect(new Post()).to.be.an.instanceOf(Model);
        expect(Post.endpoint).to.equal('api/posts');
    });

    it('attaches model definitions to itself', function () {
        expect(Eloquent.Post).to.equal(Eloquent('Post'));
    });

    it('makes models independent of each other', function () {
        Eloquent('Comment', {});
        expect(Eloquent.Comment.endpoint).to.be.undefined;
    });
});
