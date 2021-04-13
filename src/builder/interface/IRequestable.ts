import { GraphQlRequestType } from "../../client/prepareDocument";

export interface IRequestable {
    readonly type: GraphQlRequestType
};

export default IRequestable;
