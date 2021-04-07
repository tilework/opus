import Mutation from "../util/Query/Mutation";
import Query from "../util/Query/Query";
import Batch from "../util/Query/Batch";

describe('batches are built', () => {
    it('builds batched queries', () => {
        const firstQuery = new Query('first').addField('one');
        const secondQuery = new Query('second').addField('two');

        const combinedField = new Batch()
            .addField(firstQuery)
            .addField(secondQuery);
    
        expect(combinedField.getFields().length).toBe(2);
    })

    it('builds batched mutations', () => {
        const firstMutation = new Mutation('first').addField('one');
        const secondMutation = new Mutation('second').addField('two');

        const combinedField = new Batch()
            .addField(firstMutation)
            .addField(secondMutation);
    
        expect(combinedField.getFields().length).toBe(2);
    })

    it('throws on mixed batches', () => {
        const mutation = new Mutation('mut').addField('one');
        const query = new Query('que').addField('two');

        expect(() => {
            const combinedField = new Batch()
                .addField(mutation)
                .addField(query);
        }).toThrow();
    })
});