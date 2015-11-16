import {expect} from 'chai';
import sinon from 'sinon';
import Transport from '../src/Query/Transport';
import fetchMock from 'fetch-mock/src/server';

/** @test {Transport} */
describe('Transport', function () {

    let entity = { id: 1 };

    beforeEach(() => fetchMock.mock('test', entity));
    afterEach(() => fetchMock.restore());

    /** @test {Transport#get} */
    describe('get()', function () {
        it('makes a GET request', function () {
            return Transport.get('test').then(function () {
                expect(fetchMock.calls().length).to.equal(1);
            });
        });

        it('resolves with the returned JSON', function () {
            return Transport.get('test').then(function (response) {
                expect(response).to.eql(entity);
            });
        });
    });

});
