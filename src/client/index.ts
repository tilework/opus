import CombinedField from '../builder/CombinedField';
import { prepareRequest } from './prepare-document';
import parseResponse from './parse-response';
import { executePost } from './post';
import Mutation from '../builder/Mutation';
import Query from '../builder/Query';
import AbstractField from '../builder/AbstractField';
import deep from '../util/deep-apply';
import { DataType } from '../util/data-type';

export interface GraphQlResponse {
    errors: string | Error | Error[],
    data: unknown
}

export type Middleware = (response: GraphQlResponse) => unknown;

export type RequestOptions = {
    endpoint: string,
    headers?: Record<string, string>
} & Omit<RequestInit, 'method' | 'body' | 'headers'>;

export const defaultOptions: RequestOptions = {
    endpoint: process.env.GRAPHQL_ENDPOINT || '/graphql'
};

export class Client {
    protected options: RequestOptions = defaultOptions;

    setEndpoint = (endpoint: string): void => {
        this.options.endpoint = endpoint;
    };

    setHeaders = (headers: Record<string, string>): void => {
        this.options.headers = headers;
    };

    getOptions = (): RequestOptions => this.options;

    async post<N extends string, RT, A extends boolean>(
        rawField: Query<N, RT, A> | Mutation<N, RT, A>,
        overrideOptions?: Partial<RequestOptions>
    ): Promise<DataType<typeof rawField>>;

    async post<RT>(
        rawField: CombinedField<RT>,
        overrideOptions?: Partial<RequestOptions>
    ): Promise<DataType<typeof rawField>>;

    async post(
        rawField: any,
        overrideOptions?: Partial<RequestOptions>
    ) {
        const fieldArray = rawField instanceof CombinedField ? rawField.getFields() : [rawField];

        if (!fieldArray.length) {
            throw new Error('Attempting to post empty field!');
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

        if (rawField instanceof CombinedField) {
            for (const field of rawField.getFields()) {
                await this.process(field, parsedResponse[field.name], parsedResponse)
            }
        } else {
            await this.process(rawField, parsedResponse[rawField.name], parsedResponse);
        }

        deep(Object.freeze, parsedResponse);
        
        return parsedResponse;
    };

    /**
     * Handles calculating and transforming fields on result
     */
    protected async process(field: AbstractField<any, any, any>, result: any, parentResult: any) {
        // Prevent calculating for non-object fields from the result
        if (!field.children.length) {
            return;
        }

        // If array - process each separately
        if (Array.isArray(result)) {
            for (const item of result) {
                await this.process(field, item, parentResult);
            }
        } else {
            // If has children - process children first
            for (const child of field.children) {
                if (child.tag === 'InlineFragment') {
                    for (const fragmentChild of child.children) {
                        if (!Object.hasOwnProperty.call(result, fragmentChild.name)) {
                            continue;
                        }

                        await this.process(fragmentChild, result[fragmentChild.name], result);
                    }
                } else {
                    await this.process(child, result[child.name], result);
                }
            }

            // POSTVISIT - calculate the actual fields
            for (const [fieldName, calculator] of Object.entries(field.calculators)) {
                result[fieldName] = await calculator(result);
            }

            // Prevent adding new properties from now on
            deep(Object.seal, result);

            if (field.transformer) {
                parentResult[field.name] = await field.transformer(result);
            }

            // TODO in dev mode we can compare own props to prevent extending in improper ways
        }
    }
}

export default Client;
