import AbstractField from './AbstractField';

/** @namespace Graphql/Util/Query/InlineFragment/InlineFragment */
export class InlineFragment<
    N extends string, 
    RT
> extends AbstractField<N, RT, false> {
    readonly tag = 'InlineFragment';

    constructor(name: N) {
        super(`... on ${name}` as N);
    }
}

export default InlineFragment;
