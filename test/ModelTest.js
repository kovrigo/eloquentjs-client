import {expect} from 'chai';
import sinon from 'sinon';
import Model from '../src/Eloquent/Model';
import EloquentBuilder from '../src/Eloquent/Builder';

/** @test {Model} */
describe('Model', function () {

    let Person = class extends Model {};
    let person;
    let attributes = {
        name: 'Dave',
        email: 'dave@example.com'
    };

    beforeEach(function () {
        person = new Person(attributes);
    });

    it('exposes attributes as public properties', function () {
        expect(person.name).to.equal('Dave');
    });

    /** @test {Model#getAttributes} */
    it('gets all its attributes', function () {
        expect(person.getAttributes()).to.eql(attributes)
    });

    /** @test {Model#setAttributes} */
    it('can have its attributes changed', function () {
        person.setAttribute('name', 'Dorothy');
        expect(person.name).to.equal('Dorothy');

        person.name = 'Doris';
        expect(person.getAttribute('name')).to.equal('Doris');
    });

    /** @test {Model#getDirty} */
    it('gets the changed attributes', function () {
        person.name = 'Donna';
        expect(person.getDirty()).to.eql({
            name: 'Donna'
        });
    });

    /** @test {Model#newQuery} */
    it('gets a new query builder from a model instance', function () {
        let builder = person.newQuery();
        expect(builder).to.be.an.instanceOf(EloquentBuilder);
        expect(builder._getModel()).to.equal(person);
    });

    /** @test {Model#query} */
    it('gets a new query builder from the model prototype', function () {
        let builder = Person.query();
        expect(builder).to.be.an.instanceOf(EloquentBuilder);
        expect(builder._getModel()).to.be.an.instanceOf(Person);
    });


    describe('query builder', function () {
        it('proxies query methods to a new builder instance', function () {
            expect(person.where('a', '=', 'b')).to.be.an.instanceOf(EloquentBuilder);
        });

        it('can be called statically', function () {
            expect(Person.where('a', '=', 'b')).to.be.an.instanceOf(EloquentBuilder);
        });
    });

});
