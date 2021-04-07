import AbstractField from './AbstractField';

/** @namespace Graphql/Util/Query/Field/Field */
export class Field<Name extends string, FieldReturnType, A extends boolean> extends AbstractField<Name, FieldReturnType, A> {
    readonly tag = 'Field';
}

export default Field;
