import jwt from 'jsonwebtoken';
import sequelize from '../db/pgConnect.js';
import User from '../models/user.model.js';
import Food from '../models/food.model.js'; 

// 사료 잔량 계산 로직 
export const calculate_reamains = async(req, res, next) => {
try{
    console.log("사료 잔량 계산 로직 -- ")
    const food_remain_amount = req.body.food_remain_grade;
    const food = req.body.feed_id;
    // 사료 찾기 
    const selectedFood = await Food.findOne({
        where : { food_id : food }
    });
    const gangG_size = req.body.pet_size;
    console.log(gangG_size);
    var required_amount;

    // 강아주 크기별로 권장량 계산하는 로직 
    // TODO : 권장량이 없는 경우 에러 처리 하는 로직 구현 
    if(gangG_size== 'SMALL'){
        required_amount = selectedFood.food_amount_small;
        console.log("소형 권장량 : ", required_amount);
    }else if(gangG_size =='MEDIUM'){
        required_amount = selectedFood.food_amount_medium;
        console.log("중형 권장량 : ", required_amount);
    }else if(gangG_size == 'LARGE'){
        console.log("대형 권장량 : ", required_amount);
        required_amount = selectedFood.food_amount_large;
    }else{
        console.log("유효하지 않은 강아지 크기입니다.")
        var error4 = Error("유효하지 않은 pet_size 코드입니다.");
        error4.status = 400;
        next(error4);
    }
    const amount = selectedFood.food_amount_total; //사료 총량 

    console.log("사료 총량 : ", amount);
    console.log("사료 남은 량 : ", food_remain_amount);

    var remain_amount = 0;


    if(food_remain_amount =='A'){   //70percent
        remain_amount = Math.floor(amount * 0.7);
        console.log("사료 계산 결과 : ", remain_amount);
    }else if(food_remain_amount =='B'){   //30percent 
        remain_amount = Math.floor(amount * 0.3);
        console.log("사료 계산 결과 : ", remain_amount);
    }else if(food_remain_amount == 'C'){ //10percent
        remain_amount = Math.floor(amount * 0.1);
        console.log("사료 계산 결과 : ", remain_amount);
    }else{
        console.log("유효하지 않은 사료 잔량 코드입니다.")
        var error2 = Error("유효하지 않은 food_remain_amount 코드입니다.");
        error2.status = 400;
        next(error2);
    }

    const remain_days = Math.floor(remain_amount / required_amount);
    req.grade = food_remain_amount;
    req.remains = remain_amount;
    req.days = remain_days;
    req.required = required_amount;
    next();
}catch(error){
        console.error(error.message);
        return next(error);
}
};