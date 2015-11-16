import Eloquent from '../src/index';
import Model from '../src/Eloquent/Model';
import {expect} from 'chai';

/*
 * These tests rely on the global state of the Eloquent function
 * object. Since we're only testing syntactic sugar for the
 * default export, this isn't a huge problem.
 */
describe('default export', function () {

    it('defines a model', function () {
        Eloquent('Post', { endpoint: 'api' });
    });

    it('returns a previously defined model', function () {
        let Post = Eloquent('Post');
        expect(new Post()).to.be.an.instanceOf(Model);
        expect(Post.endpoint).to.equal('api');
    });

    it('attaches model definitions to itself', function () {
        expect(Eloquent.Post).to.equal(Eloquent('Post'));
    });
});
