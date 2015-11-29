import {expect} from 'chai';
import sinon from 'sinon';
import Transport from '../src/Query/Transport';
import fetchMock from 'fetch-mock/src/server';

/** @test {Transport} */
describe('Transport', function () {

    let entity = { id: 1 };
    let transport;

    beforeEach(() => transport = new Transport());
    afterEach(() => fetchMock.restore());

    /** @test {Transport#get} */
    describe('get()', function () {

        beforeEach(() => fetchMock.mock('^test', 'get', entity));

        it('makes a GET request', function () {
            return transport.get('test').then(function () {
                expect(fetchMock.calls().length).to.equal(1);
            });
        });

        it('passes the current query in a JSON-encoded GET parameter', function() {
            return transport.get('test', ['stack']).then(function () {
                expect(fetchMock.calls()[0][0]).to.equal('test?query='+JSON.stringify(['stack']));
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

        it('makes a POST request with a body of JSONified data', function () {
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

    /** @test {Transport#put} */
    describe('put()', function () {

        let attributes = { age: 50, color: 'green' };

        beforeEach(() => fetchMock.mock('^api/things', 'put', attributes));

        it('makes a PUT request with a body of JSONified data', function () {
            return transport.put('api/things', attributes).then(function () {
                expect(fetchMock.calls().length).to.equal(1);
                expect(fetchMock.calls()[0][1].body).to.equal(JSON.stringify(attributes));
            });
        });

        it('passes the current query in a JSON-encoded GET parameter', function() {
            return transport.put('api/things', attributes, ['stack']).then(function () {
                expect(fetchMock.calls()[0][0]).to.equal('api/things?query='+JSON.stringify(['stack']));
            });
        });

        it('resolves with the returned JSON', function () {
            return transport.put('api/things', attributes).then(function (response) {
                expect(response).to.eql(attributes);
            });
        });
    });

    /** @test {Transport#delete} */
    describe('delete()', function () {

        beforeEach(() => fetchMock.mock('^api/things', 'delete', {}));

        it('makes a DELETE request', function () {
            return transport.delete('api/things').then(function () {
                expect(fetchMock.calls().length).to.equal(1);
            });
        });

        it('passes the current query in a JSON-encoded GET parameter', function() {
            return transport.delete('api/things', ['stack']).then(function () {
                expect(fetchMock.calls()[0][0]).to.equal('api/things?query='+JSON.stringify(['stack']));
            });
        });

        it('resolves with a success/failure boolean', function () {
            return transport.delete('api/things').then(function (response) {
                expect(response).to.be.a('boolean');
            });
        });
    });
});
