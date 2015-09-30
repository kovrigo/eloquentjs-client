import {expect} from 'chai';
import sinon from 'sinon';
import Transport from '../src/Transport';

describe('Transport', function () {

    let mockResponse;
    let transport;
    let fetchStub;
    let entity = { id: 1 };

    beforeEach(function () {
        mockResponse = { json: sinon.stub().returns(entity) };
        fetchStub = sinon.stub().resolves(mockResponse);
        transport = new Transport(fetchStub);
    });

    describe('get()', function () {
        it('makes a GET request', function () {
            transport.get('test');
            expect(fetchStub).to.have.been.calledWith('test');
        });
        it('resolves with the returned JSON', function () {
            return transport.get('test').then(function (response) {
                expect(response).to.equal(entity);
            });
        });
    });

});
