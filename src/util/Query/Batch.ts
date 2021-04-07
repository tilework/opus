import Mutation from './Mutation';
import Query from './Query';
import { GraphQlRequestType } from '../Request/prepareDocument';
import AbstractField from './AbstractField';

/** @namespace Graphql/Util/Query/CombinedField/CombinedField */
export class Batch<IRT> {
    type?: GraphQlRequestType;

    resultTypeHolder?: IRT;
    
    protected fields: AbstractField<any, any, any>[] = [];

    addField<N extends string, A extends boolean, RT>(
        field: Query<N, RT, A> | Mutation<N, RT, A>
    ): Batch<IRT & {[k in N]: A extends true ? RT[] : RT}> {
        // Handle first field
        if (!this.type) {
            this.type = field.type;

        // Handle attempt to batch queries together with mutations
        } else if (this.type !== field.type) {
            throw new Error('Cannot batch queries and mutations together!');
        }

        this.fields.push(field);

        return this as any;
    }

    getFields = () => this.fields;
}

export default Batch;
