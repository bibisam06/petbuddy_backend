export const sendResponse = (res, { data, responseCode = 200, responseMessage = 'success' }) => {
    return res.status(responseCode).json({
        response_code: responseCode,
        response_message: responseMessage,
        data: data
    });
};

export const sendError = (res, { errorMessage = 'Internal Server Error', responseCode = 500 }) => {
    return res.status(responseCode).json({
        response_code: responseCode,
        response_message: errorMessage,
        data: null
    });
};