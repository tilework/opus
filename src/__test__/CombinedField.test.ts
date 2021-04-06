import Mutation from "../api/Mutation";
import Query from "../api/Query";
import CombinedField from "../util/Query/CombinedField";

describe('combined fields are built', () => {
    it('builds combined queries', () => {
        const firstQuery = new Query('first').addField('one');
        const secondQuery = new Query('second').addField('two');

        const combinedField = new CombinedField()
            .addField(firstQuery)
            .addField(secondQuery);
    
        expect(combinedField.fields.length).toBe(2);
    })

    it('builds combined mutations', () => {
        const firstMutation = new Mutation('first').addField('one');
        const secondMutation = new Mutation('second').addField('two');

        const combinedField = new CombinedField()
            .addField(firstMutation)
            .addField(secondMutation);
    
        expect(combinedField.fields.length).toBe(2);
    })

    it('builds mixed batches', () => {
        const mutation = new Mutation('mut').addField('one');
        const query = new Query('que').addField('two');

        const combinedField = new CombinedField()
            .addField(mutation)
            .addField(query);

        expect(combinedField.fields.length).toBe(2);
    })
});