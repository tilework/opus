import Batch from '../builder/Batch';
import { prepareRequest } from './prepare-document';
import parseResponse from './parse-response';
import { executePost } from './post';
import Mutation from '../builder/Mutation';
import Query from '../builder/Query';

export interface GraphQlResponse {
    errors: string | Error | Error[],
    data: unknown
}

export type Middleware = (response: GraphQlResponse) => unknown;

export type RequestOptions = {
    endpoint: string,
    headers?: any
};

export const defaultOptions: RequestOptions = {
    endpoint: process.env.GRAPHQL_ENDPOINT || '/graphql'
};

/** @namespace Graphql/Index/Client */
export class Client {
    protected options: RequestOptions = defaultOptions;

    setEndpoint = (endpoint: string): void => {
        this.options.endpoint = endpoint;
    };

    setHeaders = (headers: any): void => {
        this.options.headers = headers;
    };

    getOptions = (): RequestOptions => this.options;

    async post<N extends string, RT, A extends boolean>(
        rawField: Query<N, RT, A> | Mutation<N, RT, A>,
        overrideOptions?: Partial<RequestOptions>
    ): Promise<{[k in N]: A extends true ? RT[] : RT}>;

    async post<N extends string, RT>(
        rawField: Batch<RT>,
        overrideOptions?: Partial<RequestOptions>
    ): Promise<RT>;

    async post(
        rawField: any,
        overrideOptions?: Partial<RequestOptions>
    ) {
        const fieldArray = rawField instanceof Batch ? rawField.getFields() : [rawField];

        if (!fieldArray.length) {
            throw new Error('Attempting to post empty batch!');
        }

        const response = await executePost(
            prepareRequest(fieldArray, rawField.type!),
            // TODO deep merge
            {
                ...this.options,
                ...(overrideOptions || {})
            }
        );

        const parsedResponse = parseResponse(await response.json());

        return parsedResponse;
    };
}

export default Client;
