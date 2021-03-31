import type Field from './Field';

/** @namespace Graphql/Util/Query/CombinedField/CombinedField */
export class CombinedField<IRT> {
    fields: Field<string, unknown>[] = [];

    addField<N extends string, RT>(field: Field<N, RT>): CombinedField<IRT & {[k in N]: RT}> {
        this.fields.push(field);

        return this;
    }
}

export default CombinedField;
