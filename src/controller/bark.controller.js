/*
FitBark 리다이렉트 및 활동량 조회 및 저장 부분입니다 - 핏바크연동 
*/

// model Import 
import Activity from "../models/activity.log.model.js";
import UserToken from "../models/user.token.model.js";

// middleware Import 
import { sendResponse } from "../util/response.util.js";

export const fitBarkRedirect = async (req, res, next) => {
try{
    console.log("======FitBark=======");
    const token = req.query.code; 
    const now = Date.now();
    const data = await UserToken.create({
        user_id : req.user.user_id,
        user_token : token,
        refresh_expires_at : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14일 후 만료
        //TODO : 만료 시간 알아보고 이거 수정 필요함 
    });

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


export const fitBarkOAuth = async(req, res, next) => {
try{

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


export const fitBarkRefresh = async(req, res, next) => {
try{

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