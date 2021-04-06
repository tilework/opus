import AbstractField from './AbstractField';

/** @namespace Graphql/Util/Query/Field/Field */
export class Field<Name extends string, FieldReturnType> extends AbstractField<Name, FieldReturnType> {
    readonly tag = 'Field';
}

export default Field;
