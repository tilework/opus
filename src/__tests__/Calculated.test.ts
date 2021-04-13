import client, { Query, Field } from '..';

const ONE_KG_IN_LBS = 2.20462;

client.setEndpoint('https://api.spacex.land/graphql/');

const query = new Query('dragons', true)
    .addField('active')
    .addField(new Field('launch_payload_mass')
        .addField('kg')
        .addField('lb')
        .addCalculatedField('lb_calculated', (result) => result.kg * ONE_KG_IN_LBS)
    )
    .addField(new Field('return_payload_mass')
        .addField('kg')
    )
    .addCalculatedField('payload_delta', (result) => {
        return result.launch_payload_mass.kg - result.return_payload_mass.kg;
    });

const pending = client.post(query);

describe('calculated fields are working OK', () => {
    it('calculates fields', async () => {
        const result = await pending;

        for (const dragon of result.dragons) {
            expect(dragon.payload_delta).toBeDefined();
            expect(dragon.payload_delta).toBeGreaterThan(0);
            expect(dragon.payload_delta).toBe(dragon.launch_payload_mass.kg - dragon.return_payload_mass.kg);

            expect(dragon.launch_payload_mass.lb_calculated).toBeDefined()
            expect(dragon.launch_payload_mass.lb_calculated).toBeCloseTo(dragon.launch_payload_mass.lb, 0);
        }
    })
})