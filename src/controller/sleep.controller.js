
const FITBARK_SLEEP_URL = "https://app.fitbark.com/api/v2/"
export const getDailySleepStatus= async(req, res, next) => {
try{


return sendResponse(res, {
    responseCode : 200,
    responseMessage : "test done",
    data : null
})
}catch(error){
    console.error(error.message);
    next(error);
}
};