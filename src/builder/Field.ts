import AbstractField from './AbstractField';

export class Field<
    Name extends string, 
    FieldReturnType, 
    IsArray extends boolean = false
> extends AbstractField<Name, FieldReturnType, IsArray> {
    readonly tag = 'Field';
}

export default Field;
