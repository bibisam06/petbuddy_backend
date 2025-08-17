/*
FitBark 리다이렉트 및 활동량 조회 및 저장 부분입니다 - 핏바크연동 
*/

// model Import 
import { UserNotFoundError } from "../error/error.handler.js";
import Activity from "../models/activity.log.model.js";
import UserToken from "../models/user.token.model.js";

// Service Logic Import 
import { getUserCredentials } from "../services/bark.service.js";


// middleware Import 
import { sendResponse } from "../util/response.util.js";

export const fitBarkRedirect = async (req, res, next) => {
try{
    console.log("======FitBark=======");
    const userId = req.query.user_id;
    const token = req.query.code; 
    if(!userId){
        throw new UserNotFoundError('해당 아이디를 가지는 사용자가 존재하지 않습니다.')
    }
    const now = Date.now();
    const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 현재 + 14일

    //TODO req User Id 어떻게 들어오는지 확인하고 이거 수정해야함
    const response = await getUserCredentials(token, userId);
    
    console.log("response찍어봐야함.. ", response);
    const result = await UserToken.create({
        user_token : response.token, //TODO : token -> access_token ? 
        user_id : userId,
        refresh_expires_at : expiresAt
    });

    return sendResponse(res, {
        responseCode : 200,
        responseMessage : "created..(testing)",
        data : result
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