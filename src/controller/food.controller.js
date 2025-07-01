import { sendError, sendResponse } from "../util/response.util.js";
import Food from '../models/food.model.js';
import FeedReport from "../models/feed.log.model.js";
import { BadFoodRequest, NoFoodError } from "../error/error.handler.js";


export const getAllFood = (async (req, res, next)=> {
try{

    const allFoodData = await Food.findAll({
        attributes : ['food_id', 'food_name', 'food_code', 'food_brand']
    });

    if(!allFoodData){
        throw NoFoodError();
    }

    
    return sendResponse(res, {
        responseCode : 200,
        responseMessage : "사료 조회",
        data : allFoodData
    });
    } catch (error) {
    console.error(error.message);
    next(error);
    }
});


export const convertFood = async (req, res, next) => {
try{
    const dog = req.dog; 
    const newfoodId = req.query.food_id;

    // 원래 사료 마감처리 
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
    originalFood.food_close_yn = true;
    await originalFood.save();

    //사료 로그 새로 추가하기 
    const newfood = await Food.findOne({
        where : {
            food_id : newfoodId
        }
    });

    if(!newfood){
        throw new BadFoodRequest("잘못된 사료 아이디입니다");
    }
    // 강아주 크기별로 권장량 계산하는 로직 
    const gangG_size = dog.pet_size;

    var required_amount; // 변수 선언 
    // TODO : 중복로직 미들웨어로 뺄 필요있음..
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
            food_remain_amount : newFoodLog.food_remain_amount
        }
    })
}catch(error){
    console.error(error.message);
    next(error);
}
};


export const endFeedReport = async (req, res, next) => {
try{
    const dog = req.dog; 
    const foods = await FeedReport.findOne({
        where : {
            pet_id : dog.pet_id,
            food_close_yn : false
        }
    }); // 마감안된거 찾아서,, 
    foods.food_close_yn = false;
    await foods.save(); //update

    return sendResponse(res, {
        responseCode : 200, 
        responseMessage : "강아지 사료를 마감처리했습니다.",
        data : {
            food_id : foods.food_id 
        }
    });
}catch(error){
    console.error(error.message);
    next(error);
}
};

// 사료 추가 로직 
export const addFeedReport = async (req, res, next) => {
try{
    const dog = req.dog; 
    const numbers = req.query.foodOrder;
    console.log(numbers);
    const foods = await FeedReport.findOne({
        where : {
            pet_id : dog.pet_id,
            food_close_yn : false
        }
    }); // 마감안된거 찾아서,, 

    if(!foods){
        throw new NoFoodError("마감되지 않은 사료 로그가 존재하지 않습니다.");
    }

    foods.food_add_yn = true;


    const foodData = await Food.findOne({
        where : {
            food_id : foods.food_id
        }
    });

    foods.food_remain_amount += (foodData.food_amount_total * numbers);
    
    const gangG_size = dog.pet_size;

      var required_amount; // 변수 선언 
    // TODO : 중복로직 미들웨어로 뺄 필요있음..
    if(gangG_size== 'SMALL'){
        required_amount = foodData.food_amount_small;
        console.log("소형 권장량 : ", required_amount);
    }else if(gangG_size =='MEDIUM'){
        required_amount = foodData.food_amount_medium;
        console.log("중형 권장량 : ", required_amount);
    }else if(gangG_size == 'LARGE'){
        console.log("대형 권장량 : ", required_amount);
        required_amount = foodData.food_amount_large;
    }else{
        console.log("유효하지 않은 강아지 크기입니다.")
        var error4 = Error("유효하지 않은 pet_size 코드입니다.");
        error4.status = 400;
        next(error4);
    }
    const days = Math.floor(foodData.food_amount_total/required_amount);

    console.log(days);

    foods.food_remain_days += days;
    await foods.save();
}catch(error){
    console.error(error.message);
    next(error);
}
};