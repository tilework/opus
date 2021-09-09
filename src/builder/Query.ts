import AbstractField from "./AbstractField";
import { GraphQlRequestType } from "../client/prepare-document";
import { IRequestable } from "./interface/IRequestable";

class Query<
    Name extends string,
    FieldReturnType,
    IsArray extends boolean = false
> extends AbstractField<Name, FieldReturnType, IsArray> implements IRequestable {
    readonly tag = 'Query';

    readonly type = GraphQlRequestType.Query;
}

export default Query;