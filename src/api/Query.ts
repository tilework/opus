import AbstractField from "../util/Query/AbstractField";
import { GraphQlRequestType } from "../util/Request/prepareDocument";
import { IRequestable } from "./common";

class Query<N extends string, RT> extends AbstractField<N, RT> implements IRequestable {
    readonly tag = 'Query';

    readonly type = GraphQlRequestType.Query;
}

export default Query;