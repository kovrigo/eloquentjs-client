import {expect} from 'chai';
import sinon from 'sinon';
import Model from '../src/Model';

describe('Model', function () {

    let person;

    beforeEach(function () {
        person = new Model({
            name: 'Dave',
            email: 'dave@example.com'
        });
    });

    it('exposes attributes as public properties', function () {
        expect(person.name).to.equal('Dave');
    });

    it('gets all its attributes', function () {
        expect(person.getAttributes()).to.eql({
            name: 'Dave',
            email: 'dave@example.com'
        })
    });

    it('can have its attributes changed', function () {
        person.setAttribute('name', 'Dorothy');
        expect(person.name).to.equal('Dorothy');

        person.name = 'Doris';
        expect(person.getAttribute('name')).to.equal('Doris');
    });

    it('gets the changed attributes', function () {
        person.name = 'Donna';
        expect(person.getDirty()).to.eql({
            name: 'Donna'
        });
    });
});
