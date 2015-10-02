import {expect} from 'chai';
import sinon from 'sinon';
import Manager from '../src/Manager';
import Model from '../src/Eloquent/Model';
import {merge} from 'lodash';

describe('Manager', function () {

    let manager;

    beforeEach(function () {
        manager = new Manager();
    });

    it('defines an Eloquent model', function () {
        manager.define('Post', {});
        expect(manager.registry[0]).to.contain({ name: 'Post' });
    });

    it('gets a previously defined model', function () {
        manager.define('Post', {});
        let Post = manager.named('Post');
        expect(new Post()).to.be.an.instanceof(Model);
    });

    it('applies the given properties to the returned class', function () {
        manager.define('Post', { foo: 'bar' });
        let Post = manager.named('Post');
        expect(Post.foo).to.equal('bar');
    });

    it('throws if the requested model has not been defined', function () {
        expect(() => manager.named('Comment')).to.throw();
    });

    it('accepts a callback that provides the model definition', function () {
        let callback = sinon.stub().returns('PostClass');
        manager.define('Post', callback);
        expect(manager.named('Post')).to.equal('PostClass');
        expect(callback).to.have.been.called;
    });

});
