/*
FitBark 리다이렉트 및 활동량 조회 및 저장 부분입니다 - 핏바크연동 
*/
//import
import axios from "axios";
// model Import 
import { response } from "express";
import { UserNotFoundError } from "../error/error.handler.js";
import Activity from "../models/activity.log.model.js";
import UserToken from "../models/user.token.model.js";

// Service Logic Import 
import { getUserCredentials } from "../services/bark.service.js";

// middleware Import 
import { sendResponse } from "../util/response.util.js";

export const fitBarkRedirect = async (req, res, next) => {
try{
  console.log("======FitBark리디렉션 로직=======");

  const token = req.query.code; 
  const state = req.query.state;

  //문자열을 , 로 나누고 숫자로 변환
  const [userId, petId] = state.split(",").map(Number);
 
  console.log("token is ", token);

  console.log("앞 숫자:", userId);   // 13
  console.log("뒤 숫자:", petId); // 70

  if(!userId){
        throw new UserNotFoundError('요청에 사용자의 아이디 정보가 존재하지 않습니다...');
        // -> 
        // TODO : 이거 다시 우리 서버로 요청 보내서 결과띄워야함.. 
  }

  if(!petId){
        throw new UserNotFoundError('요청에 강아쥐의 아이디 정보가 존재하지 않습니다...');
        // -> 
        // TODO : 이거 다시 우리 서버로 요청 보내서 결과띄워야함.. 
  }
  const now = Date.now(); // 숫자
  const expiresAt = new Date(now + 31557600 * 1000); // 만료기간 1년 

  const response = await getUserCredentials(token);
    
  const result = await UserToken.upsert({
    user_id: userId,               // 기존 토큰 존재 시, 새로 생성하지 않고 업데이트 함 
    pet_id : petId,
    user_token: response.access_token,
    refresh_expires_at: expiresAt,  
    });

    console.log(result);

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

export const fitBarkRedirectTest = async(req, res, next) => {
try{
console.log(req.query.code);
console.log(req.query.state);

return sendResponse({
    responseCode : 200,
    responseMessage : "message",
    data : req.query.code
});

}catch(error){
    console.error(error.message);
    next(error);
}
};


export const fitBarkAuthCode = async(req, res, next ) => {
try{
    console.log()
}catch(error){
    console.error(error.message);
    next(error);
}
};

const FITBARK_CREDENTIALS2 = "https://app.fitbark.com/oauth/token";
export const testCredentials = async (req, res, next) => {
  try {

    const code = req.query.code;

    const response = await axios.post(
      FITBARK_CREDENTIALS2, // https://api.fitbark.com/oauth/token
      {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://backend.pawprint.ai.kr/bark/redirect",
        client_id: process.env.FITBARK_CLIENT_ID,
        client_secret: process.env.FITBARK_CLIENT_SECRET
      },
      {
        headers: {
          "Content-Type": "application/json", // JSON으로 보내기
        },
      }
    );

    return res.json(response.data); // { access_token, refresh_token, expires_in ... }

  } catch (error) {
    console.error(error.response?.data || error.message);
    next(error);
  }
};