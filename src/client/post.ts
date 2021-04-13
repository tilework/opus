import { RequestOptions } from '.';
import { GraphQLDocument } from './prepare-document';

if (typeof fetch === 'undefined') {
    var fetch = require('node-fetch');
}

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
    options: RequestOptions
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
) => {
    const { query, variables } = queryObject;

    return postFetch(query, variables, options);
};
