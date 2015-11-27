import {expect} from 'chai';
import sinon from 'sinon';
import Transport from '../src/Query/Transport';
import fetchMock from 'fetch-mock/src/server';

/** @test {Transport} */
describe('Transport', function () {

    let entity = { id: 1 };
    let transport;

    beforeEach(() => transport = new Transport());

    /** @test {Transport#get} */
    describe('get()', function () {

        beforeEach(() => fetchMock.mock('test', entity));
        afterEach(() => fetchMock.restore());

        it('makes a GET request', function () {
            return transport.get('test').then(function () {
                expect(fetchMock.calls().length).to.equal(1);
            });
        });

        it('resolves with the returned JSON', function () {
            return transport.get('test').then(function (response) {
                expect(response).to.eql(entity);
            });
        });
    });

    /** @test {Transport#post} */
    describe('post()', function () {

        let attributes = { age: 50, color: 'green' };

        beforeEach(() => fetchMock.mock('api/things', 'post', attributes));
        afterEach(() => fetchMock.restore());

        it('makes a POST request with the JSONified attributes', function () {
            return transport.post('api/things', attributes).then(function () {
                expect(fetchMock.calls().length).to.equal(1);
                expect(fetchMock.calls()[0][1].body).to.equal(JSON.stringify(attributes));
            });
        });

        it('resolves with the returned JSON', function () {
            return transport.post('api/things', attributes).then(function (response) {
                expect(response).to.eql(attributes);
            });
        });
    });

});
