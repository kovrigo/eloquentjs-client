import {expect} from 'chai';
import sinon from 'sinon';
import Container from '../src/Container';

/** @test {Container} */
describe('Container', function() {

    let container;
    let BaseModel = class { bootIfNotBooted() {} };
    beforeEach('create container', function() {
        container = new Container(BaseModel);
    });

    it('registers a model definition', function() {
        container.register('Post', {});
    });

    it('makes a previously registered model', function() {
        container.register('Post', {});
        let Post = container.make('Post');
        expect(new Post).to.be.an.instanceOf(BaseModel);
    });

    it('throws if asked to make an unregistered model', function() {
        expect(() => container.make('Post')).to.throw();
    });

});
