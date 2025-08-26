// controllers 
import UserController from "../user.controller.js";

// middle - ware .js 
import { sendResponse } from "../../util/response.util.js";
export const getMyPageData = async(req, res, next) => {
try{
        console.log("User is ..", req.user.user_id);
        if(!req.user) {
        const error = new Error("Token is not found");
        error.status = 404;
        throw error;
        }
        //TODO : black-list 
        const userData = await UserController.getUserData(req.user);
        return sendResponse(res, {
            responseCode : 200,
            responseMessage : "마이페이지 정보 조회 성공",
            data : userData
        });
    }
    catch(error){
        console.error(error.message);
        next(error);
    }
};