import { sendError, sendResponse } from "../util/response.util.js";
import Food from '../models/food.model.js';
import FeedReport from "../models/feed.log.model.js";
import { NoFoodError } from "../error/error.handler.js";


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


export const convertFood = async (req, res, next) => {
try{
    const dog = req.dog; 
    const newfoodId = req.query;
    // 원래 사료 마감처리 
    console.log(dog);
    const originalFood = await FeedReport.findOne({
        where : {
            pet_id : dog.pet_id,
            food_close_yn : false
        }
    });
    
    if(!originalFood){
        throw new NoFoodError();
    }
    //debugging 
    console.log("original : ", originalFood);
   // originalFood.food_close_yn = true;
    await originalFood.save();

    //사료 로그 새로 추가하기 
    const newfood = await Food.findOne({
        where : {
            food_id : newfoodId
        }
    });
    // 강아주 크기별로 권장량 계산하는 로직 
    const gangG_size = dog.pet_size;
    console.log("강아지 사이즈는..",gangG_size);

    var required_amount; // 변수 선언 
    //middleware 로 빼기 
    if(gangG_size== 'SMALL'){
        required_amount = newfood.food_amount_small;
        console.log("소형 권장량 : ", required_amount);
    }else if(gangG_size =='MEDIUM'){
        required_amount = newfood.food_amount_medium;
        console.log("중형 권장량 : ", required_amount);
    }else if(gangG_size == 'LARGE'){
        console.log("대형 권장량 : ", required_amount);
        required_amount = newfood.food_amount_large;
    }else{
        console.log("유효하지 않은 강아지 크기입니다.")
        var error4 = Error("유효하지 않은 pet_size 코드입니다.");
        error4.status = 400;
        next(error4);
    }

    const days = Math.floor(newfood.food_amount_total/required_amount);

console.log("🐶 dog 확인:", dog);
console.log("🍚 newfood 확인:", newfood);

// 이렇게 명확하게 속성값만 넘기자!
const newFoodLog = await FeedReport.create({
  pet_id: Number(dog.pet_id),
  user_id: Number(dog.user_id),
  food_id: Number(newfood.food_id),
  food_remain_amount: Number(newfood.food_amount_total),
  food_required_amount: Number(required_amount),
  food_remain_grade: 'A',
  food_remain_days: Number(days),
});

    return sendResponse(res, {
        responseCode : 201,
        responseMessage : "새로운 사료로 변경했습니다.",
        data : {
            food_name : newfood.food_name,
            food_remain_days : days,
            food_remain_amount : newfood.food_amount_total
        }
    })
}catch(error){
    console.error(error.message);
    next(error);
}
};