import Query from "../api/Query";

describe('queries are built', () => {
    it('builds a query', () => {
        const query = new Query('someQuery')
            .addField('some')
            .addField('other');

        expect(query.children.length).toBe(2);
        expect(query).toBeInstanceOf(Query);
    })
})