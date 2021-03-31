import { FetchedFieldItemType, Field } from './Field';

/** @namespace Graphql/Util/Query/InlineFragment/InlineFragment */
export class InlineFragment<
    N extends string,
    RT
> extends Field<N, RT> {
    /**
     * This is against Liskov substitution principle, but we are willing to strictly differentiate
     * Between InlineFragment and Field. Although they share functionality, they are not interchangeable.
     */
    // @ts-expect-error see above
    public readonly isField = false;

    readonly isInlineFragment: boolean = true;

    constructor(name: N) {
        super(`... on ${name}` as N);
    }

    // ERROR
    addField(arg: never): never;

    // STRING
    addField<S extends string>(field: S): InlineFragment<
        N,
        RT & { [K in S]: FetchedFieldItemType }
    >;

    // FIELD
    addField<S extends string, IRT, F extends Field<S, IRT>>(field: F): InlineFragment<
        N,
        RT & { [K in F['name']]: F['resultTypeHolder'] }
    >;

    addField(field: any): any {
        if (field instanceof InlineFragment) {
            throw new Error('Cannot add a Fragment on a Fragment!');
        }

        return super.addField(field);
    }

    // @ts-expect-error see comment for isField
    setAlias<A extends string>(alias: A): InlineFragment<A, RT> {
        this.alias = `${alias}:`;

        return this as unknown as InlineFragment<A, RT>;
    }
}

export default InlineFragment;
