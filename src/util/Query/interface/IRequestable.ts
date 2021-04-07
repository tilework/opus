import { GraphQlRequestType } from "../../Request/prepareDocument";

export interface IRequestable {
    readonly type: GraphQlRequestType
};

export default IRequestable;
