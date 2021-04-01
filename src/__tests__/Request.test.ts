import client, { Field } from '..';
import middleware from '../middleware/Common';
import CombinedField from '../util/Query/CombinedField';

client.setEndpoint('https://api.spacex.land/graphql/');
client.setMiddleware(middleware);

const dragonsQuery = new Field('dragons')
    .addArgument('limit', 'Int', 5)
    .addFieldList(['name', 'active']);

const capsulesQuery = new Field('capsules')
    .addArgument('limit', 'Int', 5)
    .addFieldList(['status', 'id']);

const combinedQuery = new CombinedField()
    .addField(dragonsQuery)
    .addField(capsulesQuery);

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

describe('data is fetched correctly', () => {
    it('is able to fetch queries', async () => {
        const result = await client.postQuery(dragonsQuery);
        expect(result).toBeDefined();

        for (const dragon of result.dragons) {
            expect(dragon).toHaveProperty('name');
            expect(dragon).toHaveProperty('active');
        }
    });

    it('is able to fetch mutations', async () => {
        const result = await client.postMutation(insertUserMutation);
        expect(result).toBeDefined();

        expect(result.insert_users.affected_rows).toBeGreaterThan(0);
        expect(result.insert_users.returning[0].name).toBe('Yegor');
        expect(result.insert_users.returning[0].rocket).toBe('SomeRocket');
    }, 15000)

    it('is able to fetch combined queries', async () => {
        const result = await client.postQuery(combinedQuery);
        expect(result).toBeDefined();

        expect(result.capsules.length).toBeLessThanOrEqual(5);
        for (const capsule of result.capsules) {
            expect(capsule).toHaveProperty('status');
            expect(capsule).toHaveProperty('id');
        }

        expect(result.dragons.length).toBeLessThanOrEqual(5);
        for (const dragon of result.dragons) {
            expect(dragon).toHaveProperty('name');
            expect(dragon).toHaveProperty('active');
        }
    })
})