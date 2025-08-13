/*
FitBark 리다이렉트 및 활동량 조회 및 저장 부분입니다 - 핏바크연동 
*/

// model Import 
import Activity from "../models/activity.log.model.js";

// middleware Import 
import { sendResponse } from "../util/response.util.js";

export const fitBarkRedirect = async (req, res, next) => {
try{
    console.log("======FitBark=======");
    console.log(req);


    return sendResponse(res, {
        responseCode : 200,
        responseMessage : "created..(testing)",
        data : null
    });
}catch(error){
    console.error(error.message);
    next(error);
}
};