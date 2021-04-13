import Mutation from "../builder/Mutation";

describe('mutations are built', () => {
    it('builds a mutation', () => {
        const mutation = new Mutation('someMutation')
            .addField('some')
            .addField('other');

        expect(mutation.children.length).toBe(2);
        expect(mutation).toBeInstanceOf(Mutation);
    })
});