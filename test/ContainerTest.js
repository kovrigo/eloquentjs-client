import {expect} from 'chai';
import sinon from 'sinon';
import Container from '../src/Container';

describe('Container', () => {

    let container;
    let factoryStub;
    let classStub;

    beforeEach(() => {
        container = new Container();
        classStub = class {};
        factoryStub = sinon.stub();
    });

    it('puts an item into the container and returns itself', () => {
        expect(container.register('something', classStub)).to.equal(container);
    });

    it('gets an item out of the container', () => {
        container.register('something', classStub);
        expect(container.get('something')).to.equal(classStub);
    });

    it('instantiates the named class', () => {
        container.register('myClass', classStub);
        expect(container.make('myClass')).to.be.an.instanceOf(classStub);
    });

    it('does nothing for non-classes', () => {
        container.register('notAClass', 'string');
        expect(container.make('notAClass')).to.equal('string');
    });

    it('throws if the requested item has not been registered', () => {
        expect(() => container.make('nothing')).to.throw;
    });

    it('registers a resolving listener and returns itself', () => {
        expect(container.resolving('myClass', factoryStub)).to.equal(container);
    });

    it('calls the resolving listener when making the item', () => {
        container.register('myClass', classStub);
        container.resolving('myClass', factoryStub);

        container.make('myClass');

        expect(factoryStub).to.have.been.calledWith(classStub, container);
    });

    it('uses the return value of the resolving listener if defined', () => {
        container.register('myClass', classStub);
        container.resolving('myClass', factoryStub.returns('INSTANCE'));

        expect(container.make('myClass')).to.equal('INSTANCE');
    });

});