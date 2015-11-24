import {expect} from 'chai';
import sinon from 'sinon';
import {merge} from 'lodash';
import Manager from '../src/Manager';
import Model from '../src/Eloquent/Model';

describe('Manager', function () {

    let manager;

    beforeEach(function () {
        manager = new Manager(Model);
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
        let callback = sinon.stub().returns(Model);
        manager.define('Post', callback);
        expect(manager.named('Post')).to.equal(Model);
        expect(callback).to.have.been.calledWith(sinon.match(function (value) {
            return Model.isPrototypeOf(value);
        }, 'Model'));
    });

    it('optionally boots the returned model class', function () {
        manager.define('Post', {});
        let model = class extends Model {};
        sinon.spy(model, 'boot');
        sinon.stub(manager, 'createDefinition').returns(model);

        manager.named('Post');

        expect(model.boot).to.have.been.calledOnce;
    });
});
