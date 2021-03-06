import { InlineFragment } from "../..";

describe('inline fragment is built', () => {
    it('builds inline fragments', () => {
        const inlineFragment = new InlineFragment('optional')
            .addField('firstThing')
            .addField('secondThing');

        expect(inlineFragment.children.length).toBe(2);
    })
})