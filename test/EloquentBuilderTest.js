import {expect} from 'chai';
import Builder from '../src/EloquentBuilder';
import QueryBuilder from '../src/QueryBuilder';

describe('EloquentBuilder', function () {

    it('extends QueryBuilder', function () {
        expect(new Builder()).to.be.instanceof(QueryBuilder);
    });



});