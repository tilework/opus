import client, { Field } from '..';
import middleware from '../middleware/Magento';

client.setEndpoint('https://api.spacex.land/graphql/');
client.setMiddleware(middleware);

describe('data is fetched correctly', () => {
    it('launches tests', () => expect(true).toBe(true));

    it('is able to process queries', async () => {
        const dragonsQuery = new Field('dragons')
            .addFieldList(['name', 'active'])
            
        const result = await client.postQuery(dragonsQuery);
        expect(result).toBeDefined();

        for (const dragon of result.dragons) {
            expect(dragon).toHaveProperty('name');
            expect(dragon).toHaveProperty('active');
        }
    });

    it('is able to process mutations', async () => {
        const insertUserMutation = new Field('insert_users')
            .addArgument('objects', '[users_insert_input!]!', {
                name: "Yegor", 
                rocket: "SomeRocket"
            })
            .addField('affected_rows')
            .addField(new Field('returning')
                .addFieldList([
                    'id', 
                    'name', 
                    'rocket'
                ])
            );

        const result = await client.postMutation(insertUserMutation);
        expect(result).toBeDefined();

        expect(result.insert_users.affected_rows).toBeGreaterThan(0);
        expect(result.insert_users.returning[0].name).toBe('Yegor');
        expect(result.insert_users.returning[0].rocket).toBe('SomeRocket');
    })
})