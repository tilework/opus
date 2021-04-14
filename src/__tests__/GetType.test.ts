import type { GetType } from '../util/get-type';
import Mutation from "../builder/Mutation";
import Query from "../builder/Mutation";
import Field from '../builder/Field';
import Batch from '../builder/Batch';

const query = new Query('person')
    .addField('name')
    .addField('surname')
    .addField(new Field('mother')
        .addField('name')
        .addField('surname')
    );

const anotherQuery = new Query('car')
    .addField('maxSpeed')
    .addField('brand');

const mutation = new Mutation('someMutation')
    .addField('some')
    .addField('other'); 

const batch = new Batch()
    .add(query)
    .add(anotherQuery)

describe('type is properly extracted', () => {
    it('extracts type from query', () => {
        const returned: GetType<typeof query> = {} as any;

        try {
            returned.person;
            returned.person.name;
            returned.person.mother;
            returned.person.mother.name;
        } catch {}
    });

    it('extracts type from a mutation', () => {
        const returned: GetType<typeof mutation> = {} as any;

        try {
            returned.someMutation;
            returned.someMutation.some;
            returned.someMutation.other;
        } catch {}
    });

    it('extracts type from a batch', () => {
        const returned: GetType<typeof batch> = {} as any;

        try {
            returned.car;
            returned.car.brand;
            returned.person;
            returned.person.name;
        } catch {}
    });
})