import { sendError, sendResponse } from "../util/response.util.js";
import Food from '../models/food.model.js';

export const getAllFood = (async (req, res)=> {
try{

    const allFoodData = await Food.findAll({
        attributes : ['food_id', 'food_name', 'food_code', 'food_brand']
    });
    console.log(allFoodData);
    return sendResponse(res, {
        responseCode : 200,
        responseMessage : "사료 조회",
        data : allFoodData
    });
    } catch (error) {
    const statusCode = error.status || 500;
    console.error(error.message);
    return sendError(res, {
            errorMessage: error.message,
            responseCode: statusCode
    });
    }
});