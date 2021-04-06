import Field from "../util/Query/Field";
import InlineFragment from "../util/Query/InlineFragment";

describe('field is built', () => {
    it('adds child fields one by one', () => {
        const field = new Field('some')
            .addField('one')
            .addField('two');

        field.resultTypeHolder.two;

        expect(field.children.length).toBe(2);
        expect(field).toBeInstanceOf(Field);
    });

    it('adds childs fields in batches', () => {
        const field = new Field('some')
            .addFieldList([
                'one', 
                'two'
            ]);

        field.resultTypeHolder.two;

        expect(field.children.length).toBe(2);
        expect(field).toBeInstanceOf(Field);
    });

    it('adds nested fields', () => {
        const field = new Field('parent')
            .addField(new Field('child')
                .addField('age')
            );

        expect(field.children[0].children[0].name).toBe('age');
        expect(field).toBeInstanceOf(Field);
    });

    // it('adds array fields', () => {
    //     const field = new Field('person')
    //         .addField('friends');

    //     field.resultTypeHolder.friends;
    // })

    it('adds inline fragments', () => {
        const field = new Field('some')
            .addField(new InlineFragment('optional')
                .addField('thing')
            );

        field.resultTypeHolder

        expect(field.children[0]).toBeInstanceOf(InlineFragment);
        expect(field.children[0].children[0].name).toBe('thing');
        expect(field).toBeInstanceOf(Field);
    });
});