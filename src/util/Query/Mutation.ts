import AbstractField from "./AbstractField";
import { GraphQlRequestType } from "../Request/prepareDocument";
import { IRequestable } from "./interface/IRequestable";

class Mutation<
    N extends string, 
    RT, 
    A extends boolean = false
> extends AbstractField<N, RT, A> implements IRequestable {
    readonly tag = 'Mutation';

    readonly type = GraphQlRequestType.Mutation;
}

export default Mutation;