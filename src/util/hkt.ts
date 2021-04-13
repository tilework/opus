import type { Field } from '../builder/Field';
import type Query from '../builder/Query'
import type Mutation from '../builder/Mutation'
import type InlineFragment from '../builder/InlineFragment';
import type AbstractField from '../builder/AbstractField';

export interface FieldDescendantStore<
    N extends string, 
    RT, 
    A extends boolean
> {
    Query: Query<N, RT, A>,
    Mutation: Mutation<N, RT, A>,
    Field: Field<N, RT, A>,
    AbstractField: AbstractField<N, RT, A>,
    InlineFragment: InlineFragment<N, RT>
}

export type HigherKindType<
    $ extends keyof FieldDescendantStore<any, any, any>,
    N extends string,
    RT,
    A extends boolean = false
> = FieldDescendantStore<N, RT, A>[$]
