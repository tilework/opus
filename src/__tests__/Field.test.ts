import Client, { Field } from '..';
import CombinedField from '../util/Query/CombinedField';
import { InlineFragment } from '../util/Query/InlineFragment';


describe('field is built', () => {
    it('adds child fields one by one', () => {
        const query = new Field('some')
            .addField('one')
            .addField('two');

        expect(query.children.length).toBe(2);
    });

    it('adds childs fields in batches', () => {
        const query = new Field('some')
            .addFieldList([
                'one', 
                'two'
            ]);

        expect(query.children.length).toBe(2);
    });

    it('adds nested fields', () => {
        const query = new Field('some')
            .addField(new Field('someChild')
                .addField('age')
            );

        expect(query.children[0].children[0].name).toBe('age');
    });

    it('adds inline fragments', () => {
        const query = new Field('some')
            .addField(new InlineFragment('optional')
                .addField('thing')
            );

        expect(query.children[0].children[0].name).toBe('thing');
    })

    it('creates combined fields', () => {
        const firstQuery = new Field('first').addField('one');
        const secondQuery = new Field('second').addField('two');

        const combinedField = new CombinedField().addField(firstQuery).addField(secondQuery);
        expect(combinedField.fields.length).toBe(2);
    })
});