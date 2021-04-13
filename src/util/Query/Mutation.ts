import AbstractField from "./AbstractField";
import { GraphQlRequestType } from "../Request/prepareDocument";
import { IRequestable } from "./interface/IRequestable";

class Mutation<
    Name extends string, 
    FieldReturnType, 
    IsArray extends boolean = false
> extends AbstractField<Name, FieldReturnType, IsArray> implements IRequestable {
    readonly tag = 'Mutation';

    readonly type = GraphQlRequestType.Mutation;
}

export default Mutation;