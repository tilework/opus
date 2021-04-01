import { InlineFragment } from './InlineFragment';

export interface Argument {
    name: string;
    type: string;
    value: string;
}

// Workaround. Should be improved when partial type inference is supported by TS.
export type FetchedFieldItemType = string | number | null;

/** @namespace Graphql/Util/Query/Field/Field */
export class Field<
    N extends string,
    RT
> {
    /**
     * This is necessary in order for TS compiler to see clear difference
     * Between Field and InlineFragment
     */
    public readonly isField = true;

    /**
     * Type of name is changeable by setting an alias onto it.
     * The actual value of name is immutable.
     */
    readonly name: N;

    alias = '';

    children: Field<string, unknown>[] = [];

    args: Argument[] = [];

    resultTypeHolder: RT = {} as RT;

    constructor(name: N) {
        this.name = name;
    }

    /**
     * This function will change type of the Field such way that it'll seem that the name has changed.
     * The name is immutable and therefore will not actually get changed.
     * This illusion is implemented so that you have proper typings for the queries' return values
     */
    setAlias<A extends string>(alias: A): Field<A, RT> {
        this.alias = `${alias}:`;

        return this as unknown as Field<A, RT>;
    }

    addArgument(name: string, type: string, value: any): Field<N, RT> {
        if (value === undefined) {
            // allow passing in all potential arguments
            return this;
        }

        this.args.push({
            name,
            type,
            value
        });

        return this;
    }

    // ! DO NOT REORDER THESE OVERLOADS
    // ! IT WILL MAKE ME MIX UP INLINE FRAGMENTS WITH FIELDS
    // ERROR
    addField(arg: never): never;

    // STRING
    addField<S extends string>(field: S): Field<
        N,
        RT & { [K in S]: FetchedFieldItemType }
    >;

    // INLINE FRAGMENT
    addField<S extends string, IRT, F extends InlineFragment<S, IRT>>(field: F): Field<
        N,
        RT & Partial<F['resultTypeHolder']>
    >;

    // FIELD
    addField<S extends string, IRT, F extends Field<S, IRT>>(field: F): Field<
        N,
        RT & { [K in F['name']]: F['resultTypeHolder'][] }
    >;
    // !

    addField(field: unknown): unknown {
        if (typeof field === 'string') {
            this.children.push(new Field(field));
        } else if (field instanceof Field) {
            this.children.push(field);
        } else {
            throw new Error('Unknown field type!');
        }

        return this;
    }

    // TODO support strings mixed with fields
    addFieldList<S extends string>(fieldList: readonly S[]): Field<
        N,
        RT & { [K in S]: FetchedFieldItemType }
    > {
        fieldList.forEach(this.addField.bind(this));

        return this as unknown as Field<
            N,
            RT & { [K in S]: FetchedFieldItemType }
        >;
    }
}

export default Field;
