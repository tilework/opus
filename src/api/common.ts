import { GraphQlRequestType } from "../util/Request/prepareDocument";

export interface IRequestable {
    readonly type: GraphQlRequestType
};