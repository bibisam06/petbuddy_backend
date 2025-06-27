export const sendResponse = (res, { data, responseCode, responseMessage}) => {
    return res.status(responseCode).json({
        response_code: responseCode,
        response_message: responseMessage,
        data: data
    });
};

export const sendError = (res, { errorMessage , responseCode }) => {
    return res.status(responseCode).json({
        response_code: responseCode,
        response_message: errorMessage,
        data: null
    });
};