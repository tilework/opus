/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { RequestOptions } from '../..';
import { GraphQLDocument } from '../Query/prepareDocument';

/** @namespace Graphql/Util/Request/Index/processHeaders */
export const processHeaders = (headers: any, options: RequestOptions): any => {
    const { headers: additionalHeaders = {} } = options;

    return {
        ...headers,
        ...additionalHeaders
    };
};

/** @namespace Graphql/Util/Request/Index/postFetch */
export const postFetch = (
    query: string,
    variables: GraphQLDocument['variables'],
    options: RequestOptions = {}
): Promise<Response> => fetch(
    options.endpoint,
    {
        method: 'POST',
        body: JSON.stringify({ query, variables }),
        headers: processHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }, options)
    }
);

/** @namespace Graphql/Util/Request/Index/executePost */
export const executePost = (
    queryObject: GraphQLDocument,
    options: RequestOptions
): unknown => {
    const { query, variables } = queryObject;

    return postFetch(query, variables, options);
};
