import Mutation from './Mutation';
import Query from './Query';
import { GraphQlRequestType } from '../util/Request/prepareDocument';
import AbstractField from './AbstractField';

/** @namespace Graphql/Util/Query/CombinedField/CombinedField */
export class Batch<ReturnType> {
    type?: GraphQlRequestType;

    resultTypeHolder?: ReturnType;
    
    protected fields: AbstractField<any, any, any>[] = [];

    add<Name extends string, FieldReturnType, IsArray extends boolean>(
        field: Query<Name, FieldReturnType, IsArray> | Mutation<Name, FieldReturnType, IsArray>
    ): Batch<ReturnType & {[k in Name]: IsArray extends true ? FieldReturnType[] : FieldReturnType}> {
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
