export interface MagentoGraphQlResponse {
    errors: string | Error | Error[],
    data: unknown[]
}

/** @namespace Graphql/Middleware/Magento/Index/checkForErrors */
export const checkForErrors = (res: MagentoGraphQlResponse): unknown | never => {
    const { errors, data } = res;

    if (errors) {
        throw errors;
    }

    return data;
};

/** @namespace Graphql/Middleware/Magento/Index/parseError */
export const parseError = (error: Error): string => {
    if (typeof error === 'string') {
        return error;
    }

    if (error.message) {
        return error.message;
    }

    if (error[0].message) {
        return error[0].message;
    }

    return 'Something went wrong';
};

/** @namespace Graphql/Middleware/Magento/Index/parseResponse */
export const parseResponse = async (pendingResponse: Promise<Response>): Promise<unknown> => {
    try {
        const response = await pendingResponse;
        const json = await response.json() as MagentoGraphQlResponse;

        return checkForErrors(json);
    } catch (e) {
        // throw new, formatted error instead
        throw new Error(parseError(e));
    }
};
