import Mutation from "../builder/Mutation";
import Query from "../builder/Query";
import Batch from "../builder/Batch";

describe('batches are built', () => {
    it('builds batched queries', () => {
        const firstQuery = new Query('first').addField('one');
        const secondQuery = new Query('second').addField('two');

        const combinedField = new Batch()
            .add(firstQuery)
            .add(secondQuery);
    
        expect(combinedField.getFields().length).toBe(2);
    })

    it('builds batched mutations', () => {
        const firstMutation = new Mutation('first').addField('one');
        const secondMutation = new Mutation('second').addField('two');

        const combinedField = new Batch()
            .add(firstMutation)
            .add(secondMutation);
    
        expect(combinedField.getFields().length).toBe(2);
    })

    it('throws on mixed batches', () => {
        const mutation = new Mutation('mut').addField('one');
        const query = new Query('que').addField('two');

        expect(() => {
            const combinedField = new Batch()
                .add(mutation)
                .add(query);
        }).toThrow();
    })
});