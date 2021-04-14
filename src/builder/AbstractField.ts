import type { HigherKindType, FieldDescendantStore } from './hkt';

export interface Argument {
    name: string;
    type: string;
    value: string;
}

// Workaround. Should be improved when partial type inference is supported by TS.
export type FetchedFieldItemType = any; //string | number | null;

export abstract class AbstractField<
    Name extends string,
    FieldReturnType,
    ArrayExpected extends boolean
> {
    /**
     * Type of name is changeable by setting an alias onto it.
     * The actual value of name is immutable.
     */
    readonly name: Name;

    readonly isArray?: ArrayExpected;
    
    readonly tag: keyof FieldDescendantStore<any, any, any> = 'AbstractField';
    
    alias = '';

    children: Array<InlineFragment<any, any> | Field<any, any, any>> = [];

    args: Argument[] = [];

    resultTypeHolder: FieldReturnType = {} as FieldReturnType;

    calculators: Record<string, (result: FieldReturnType) => any> = {};

    transformer?: (result: FieldReturnType) => any;

    constructor(
        name: Name, 
        isArray?: ArrayExpected
    ) {
        this.name = name;
        this.isArray = isArray;
    }

    /**
     * This function will change type of the Field such way that it'll seem that the name has changed.
     * The name is immutable and therefore will not actually get changed.
     * This illusion is implemented so that you have proper typings for the queries' return values
     */
    setAlias<Alias extends string>(alias: Alias): HigherKindType<
        this['tag'],
        Alias, 
        FieldReturnType,
        ArrayExpected
    > {
        this.alias = `${alias}:`;

        return this as any;
    }

    addArgument(name: string, type: string, value: any) {
        if (value === undefined) {
            return this;
        }

        this.args.push({ name, type, value });

        return this;
    }

    addCalculatedField<
        NewFieldName extends string,
        NewFieldType extends any
    >(
        field: NewFieldName, 
        calculator: (result: FieldReturnType) => NewFieldType
    ): HigherKindType<
        this['tag'],
        Name,
        FieldReturnType & { [k in NewFieldName]: NewFieldType },
        ArrayExpected
    > {
        this.calculators[field] = calculator;

        return this as any;
    }

    addTransformation<RT>(transformer: (result: FieldReturnType) => RT): HigherKindType<
        this['tag'],
        Name,
        RT,
        ArrayExpected
    > {
        this.transformer = transformer;

        return this as any;
    }

    // ! DO NOT REORDER THESE OVERLOADS
    // ! IT WILL MAKE ME MIX UP INLINE FRAGMENTS WITH FIELDS
    // ERROR
    addField(arg: never): never;

    // STRING
    addField<
        NewFieldName extends string,
        IsArray extends boolean = false
    >(
        field: NewFieldName,
        isArray?: IsArray
    ): HigherKindType<
        this['tag'], 
        Name,
        FieldReturnType & {
            [k in NewFieldName]: IsArray extends true
                ? FetchedFieldItemType[]
                : FetchedFieldItemType
        },
        ArrayExpected
    > 

    // INLINE FRAGMENT
    addField<NewField extends InlineFragment<any, any>>( 
        field: NewField
    ): HigherKindType<
        this['tag'], 
        Name, 
        FieldReturnType & Partial<NewField['resultTypeHolder']>
    >;

    // FIELD
    addField<
        F extends Field<any, any, any>
    >(
        field: F
    ): HigherKindType<
        this['tag'], 
        Name, 
        FieldReturnType & { 
            [k in F['name']]: F extends Field<any, any, true>
                ? F['resultTypeHolder'][] 
                : F['resultTypeHolder']
        },
        ArrayExpected
    >;
    // !

    addField(field: unknown): unknown {
        if (typeof field === 'string') {
            this.children.push(new Field(field));
        } else if (field instanceof Field || field instanceof InlineFragment) {
            this.children.push(field);
        } else {
            throw new Error('Unknown field type!');
        }

        return this;
    }

    addFieldList<
        NewField extends string
    >(
        fieldList: readonly NewField[]
    ): HigherKindType<
        this['tag'],
        Name,
        FieldReturnType & { [K in NewField]: FetchedFieldItemType },
        ArrayExpected
    > {
        fieldList.forEach(this.addField.bind(this));

        return this as any;
    }
}

export default AbstractField;

// Importing assets here prevents circular dependency issues
import Field from './Field';
import { InlineFragment } from './InlineFragment';
