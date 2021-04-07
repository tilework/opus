import AbstractField from "./AbstractField";
import { GraphQlRequestType } from "../Request/prepareDocument";
import { IRequestable } from "./interface/IRequestable";

class Query<
    N extends string, 
    RT, 
    A extends boolean = false
> extends AbstractField<N, RT, A> implements IRequestable {
    readonly tag = 'Query';

    readonly type = GraphQlRequestType.Query;
}

export default Query;