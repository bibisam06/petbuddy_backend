import { sendError } from '../util/response.util.js';
import { CustomError } from "../error/custom.error.js";


export const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    return sendError(res, {   
    errorMessage: message,
    responseCode: statusCode
    });
};