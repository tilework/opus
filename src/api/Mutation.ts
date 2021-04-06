import AbstractField from "../util/Query/AbstractField";
import { GraphQlRequestType } from "../util/Request/prepareDocument";
import { IRequestable } from "./common";

class Mutation<N extends string, RT> extends AbstractField<N, RT> implements IRequestable {
    readonly tag = 'Mutation';

    readonly type = GraphQlRequestType.Mutation;
}

export default Mutation;