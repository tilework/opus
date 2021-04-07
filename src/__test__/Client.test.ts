import client, { Field } from '..';
import Mutation from '../util/Query/Mutation';
import Query from '../util/Query/Query';
import middleware from '../client/middleware/Common';
import Batch from '../util/Query/Batch';

client.setEndpoint('https://api.spacex.land/graphql/');
client.setMiddleware(middleware);

const dragonsQuery = new Query('dragons', true)
    .addArgument('limit', 'Int', 5)
    .addFieldList(['name', 'active'])

const capsulesQuery = new Query('capsules', true)
    .addArgument('limit', 'Int', 5)
    .addFieldList(['status', 'id']);

const combinedQuery = new Batch()
    .addField(dragonsQuery)
    .addField(capsulesQuery);

const insertUserMutation = new Mutation('insert_users')
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
        ]),
        true
    );

describe('data is fetched correctly', () => {
    it('is able to fetch queries', async () => {
        dragonsQuery.resultTypeHolder
        const result = await client.post(dragonsQuery);
        expect(result).toBeDefined();

        for (const dragon of result.dragons) {
            expect(dragon).toHaveProperty('name');
            expect(dragon).toHaveProperty('active');
        }
    });

    it('is able to fetch mutations', async () => {
        const result = await client.post(insertUserMutation);
        expect(result).toBeDefined();

        result.insert_users

        expect(result.insert_users.affected_rows).toBeGreaterThan(0);
        expect(result.insert_users.returning[0].name).toBe('Yegor');
        expect(result.insert_users.returning[0].rocket).toBe('SomeRocket');
    }, 15000)

    it('is able to fetch combined queries', async () => {
        const result = await client.post(combinedQuery);
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