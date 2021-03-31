import Client, { Field } from '../../..';
import CombinedField from './CombinedField';
import { InlineFragment } from './InlineFragment';

const person = new Field('person')
    .addField('name')
    .addField('surname');

const mother = new Field('mother')
    .addField('name')
    .addField('surname')
    .addField('birthgivingAge');

const lumberjack = new InlineFragment('Male')
    .addField('beard')
    .addField('moustache');

const inhabitant = person
    .addFieldList([
        'nationality',
        'country',
        'city'
    ]);

const car = new Field('car')
    .addField('name')
    .addField(
        new Field('manufacturer')
            .addFieldList([
                'name', 
                'country',     
                'website'
            ])
    )
    .addFieldList(['power', 'maxSpeed'])

const combined = new CombinedField()
    .addField(inhabitant)
    .addField(car);

const son = person.addField(mother);
const beardedperson = person.addField(lumberjack);

// * Type generation checks *

person.resultTypeHolder.name; // Simple
inhabitant.resultTypeHolder.nationality; // FieldList
son.resultTypeHolder.mother.name; // Nested
beardedperson.resultTypeHolder.moustache; // Fragment
// person.resultTypeHolder.height; // Should throw on this

// * Results *

/** Query result checks */
Client.postQuery(beardedperson, {}).then((result) => {
    result
});

/** Combined query result checks */
Client.postQuery(combined, {}).then((result) => {
    result
});