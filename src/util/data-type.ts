import Batch from "../builder/Batch";
import Mutation from "../builder/Mutation";
import Query from "../builder/Query";
import { DeepReadonly } from "./deep-readonly";

export type DataType<
    T extends Query<any, any, any> | Mutation<any, any, any> | Batch<any>
> = T extends Query<infer N, infer RT, infer A> | Mutation<infer N, infer RT, infer A>
    ? DeepReadonly<{[k in N]: A extends true ? RT[] : RT}>
    : T extends Batch<infer RT>
    ? DeepReadonly<RT>
    : never;