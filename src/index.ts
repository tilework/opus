import CombinedField from './util/Query/CombinedField';
import type { Field } from './util/Query/Field';
import {
    GraphQlRequestType,
    prepareRequest
} from './util/Query/prepareDocument';
import { executePost } from './util/Request';

export type ResponseParser = (response: any) => unknown;

export type RequestOptions = {
    endpoint: string,
    headers?: any,
    middleware?: ResponseParser
};

export const defaultOptions: RequestOptions = {
    endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT || '/graphql',
    middleware: (response: any) => response
};

/** @namespace Graphql/Index/Client */
export class Client {
    protected options: RequestOptions = defaultOptions;

    protected post = async <N extends string, RT>(
        rawField: Field<N, RT> | CombinedField<RT>,
        requestType: GraphQlRequestType,
        overrideOptions?: Partial<RequestOptions>
    ) => {
        const fieldArray = rawField instanceof CombinedField ? rawField.fields : [rawField];

        const response = await executePost(
            prepareRequest(fieldArray, requestType),
            {
                ...this.options,
                ...(overrideOptions || {})
            }
        );

        const parsedResponse = this.options.middleware!(response);

        if (rawField instanceof CombinedField) {
            return parsedResponse as Promise<RT>;
        }

        return parsedResponse as Promise<{[k in N]: RT}>;
    };

    setEndpoint = (endpoint: string): void => {
        this.options.endpoint = endpoint;
    };

    setMiddleware = (parser: ResponseParser): void => {
        this.options.middleware = parser;
    };

    setHeaders = (headers: any): void => {
        this.options.headers = headers;
    };

    getOptions = (): RequestOptions => this.options;

    // ** Query **
    postQuery<N extends string, RT>(
        rawQueries: Field<N, RT>,
        overrideOptions?: Partial<RequestOptions>
    ): Promise<{ [k in N]: RT; }>;

    postQuery<RT>(
        rawQueries: CombinedField<RT>,
        overrideOptions?: Partial<RequestOptions>
    ): Promise<RT>;

    postQuery(rawQueries: any, overrideOptions: any) {
        return this.post(rawQueries, GraphQlRequestType.Query, overrideOptions);
    }

    // ** Mutation **
    postMutation<N extends string, RT>(
        rawMutations: Field<N, RT>,
        overrideOptions?: Partial<RequestOptions>
    ): Promise<{ [k in N]: RT; }>;

    postMutation<RT>(
        rawMutations: CombinedField<RT>,
        overrideOptions?: Partial<RequestOptions>
    ): Promise<RT>;

    postMutation<N extends string, RT>(rawMutations: any, overrideOptions: any) {
        return this.post(rawMutations, GraphQlRequestType.Mutation, overrideOptions)
    };
}

export { default as Field } from './util/Query/Field';
export { default as InlineFragment } from './util/Query/InlineFragment';

export default new Client();
