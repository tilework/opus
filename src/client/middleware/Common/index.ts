import { GraphQlResponse } from '../..';

/** @namespace Graphql/Middleware/Magento/Index/checkForErrors */
export const checkForErrors = (res: GraphQlResponse): unknown | never => {
    const { errors, data } = res;

    if (errors) {
        throw errors;
    }

    return data;
};

interface IError {
    message: string
}

/** @namespace Graphql/Middleware/Magento/Index/parseError */
export const parseError = (error: string | IError | IError[]): string => {
    if (typeof error === 'string') {
        return error;
    }

    if (Array.isArray(error)) {
        return error[0].message;
    }

    if (error.message) {
        return error.message;
    }

    return 'Something went wrong';
};

/** @namespace Graphql/Middleware/Magento/Index/parseResponse */
export const parseResponse = (response: GraphQlResponse): unknown => {
    try {
        return checkForErrors(response);
    } catch (e) {
        // throw new, formatted error instead
        throw new Error(parseError(e));
    }
};

export default parseResponse;