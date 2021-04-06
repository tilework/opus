import Mutation from '../../api/Mutation';
import Query from '../../api/Query';
import type Field from './Field';

// TODO support combined [query, mutation]

/** @namespace Graphql/Util/Query/CombinedField/CombinedField */
export class CombinedField<IRT> {
    fields: Array<Query<string, unknown> | Mutation<string, unknown>> = [];

    addField<N extends string, RT>(
        field: Query<N, RT> | Mutation<N, RT>
    ): CombinedField<IRT & {[k in N]: RT[]}> {
        this.fields.push(field);

        return this;
    }
}

export default CombinedField;
