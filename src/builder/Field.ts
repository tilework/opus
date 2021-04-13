import AbstractField from './AbstractField';

/** @namespace Graphql/Util/Query/Field/Field */
export class Field<
    Name extends string, 
    FieldReturnType, 
    IsArray extends boolean = false
> extends AbstractField<Name, FieldReturnType, IsArray> {
    readonly tag = 'Field';
}

export default Field;
