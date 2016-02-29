import {expect} from 'chai';
import RestfulJsonConnection from '../../src/Connection/RestfulJsonConnection';
import fetchMock from 'fetch-mock/src/server';

describe('RestfulJsonConnection', () => {

    let connection;
    let fixtures = {
        item: { id: 5, name: 'Test' },
        endpoint: 'test/posts'
    };

    beforeEach('setup connection', () => {
        connection = new RestfulJsonConnection(fixtures.endpoint);
    });
    afterEach('restore mocks', () => fetchMock.restore());

    it('requires an endpoint (URL)', () => {
        expect(() => new RestfulJsonConnection().url()).to.throw('Endpoint must be set');
        expect(() => connection.url()).not.to.throw();
    });

    /** @test {RestfulJsonConnection#read} */
    describe('read()', () => {

        beforeEach('mock GET', () => fetchMock.mock('^'+fixtures.endpoint, 'get', fixtures.item));

        it('sends requests to the endpoint', () => {
            connection.read();
            expect(fetchMock.calls()).not.to.be.empty;
        });

        it('passes the current query in a JSON-encoded GET parameter', () => {
            return connection.read(['stack']).then(function () {
                expect(fetchMock.calls()[0][0]).to.equal(fixtures.endpoint+'?query='+JSON.stringify(['stack']));
            });
        });

        it('resolves with the returned JSON', () => {
            return expect(connection.read()).to.eventually.eql(fixtures.item);
        });

    });

    /** @test {RestfulJsonConnection#create} */
    describe('create()', function () {

        let attributes = {};
        beforeEach(() => fetchMock.mock(fixtures.endpoint, 'post', fixtures.item));

        it('makes a POST request with a body of JSONified data', () => {
            return connection.create(fixtures.item).then(function () {
                expect(fetchMock.calls().length).to.equal(1);
                expect(fetchMock.calls()[0][1].body).to.equal(JSON.stringify(fixtures.item));
            });
        });

        it('resolves with the returned JSON', function () {
            return expect(connection.create(fixtures.item)).to.eventually.eql(fixtures.item);
        });
    });

    /** @test {RestfulJsonConnection#update} */
    describe('update()', function () {

        let attributes = { age: 50, color: 'green' };

        beforeEach(() => fetchMock.mock('^'+fixtures.endpoint, 'put', attributes));

        it('makes a PUT request with a body of JSONified data', function () {
            return connection.update(attributes).then(function () {
                expect(fetchMock.calls().length).to.equal(1);
                expect(fetchMock.calls()[0][1].body).to.equal(JSON.stringify(attributes));
            });
        });

        it('passes the current query in a JSON-encoded GET parameter', function() {
            return connection.update(attributes, ['stack']).then(function () {
                expect(fetchMock.calls()[0][0]).to.equal(fixtures.endpoint+'?query='+JSON.stringify(['stack']));
            });
        });

        it('resolves with the returned JSON', function () {
            return expect(connection.update(attributes)).to.eventually.eql(attributes);
        });
    });

    /** @test {RestfulJsonConnection#delete} */
    describe('delete()', function () {

        beforeEach(() => fetchMock.mock('^'+fixtures.endpoint, 'delete', {}));

        it('makes a DELETE request', function () {
            return connection.delete().then(function () {
                expect(fetchMock.calls().length).to.equal(1);
            });
        });

        it('passes the current query in a JSON-encoded GET parameter', function() {
            return connection.delete(['stack']).then(function () {
                expect(fetchMock.calls()[0][0]).to.equal(fixtures.endpoint+'?query='+JSON.stringify(['stack']));
            });
        });

        it('resolves with a success/failure boolean', function () {
            return connection.delete().then(function (response) {
                expect(response).to.be.a('boolean');
            });
        });
    });

});
