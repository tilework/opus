import type { Field } from './Query/Field';
import type Query from './Query/Query'
import type Mutation from './Query/Mutation'
import type InlineFragment from './Query/InlineFragment';
import type AbstractField from './Query/AbstractField';

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
