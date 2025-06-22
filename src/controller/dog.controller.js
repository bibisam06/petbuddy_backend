// controllers/dog.controller.js
//model - import
import FoodReport from '../models/feed.log.model.js';
import Pet from '../models/pet.model.js';
import User from '../models/user.model.js';
//middle-ware
import { sendError, sendResponse } from '../util/response.util.js';

const MAX_DOG_PER_USER = 3;
export const createDog = async (req, res) => {
  const userId = req.user.user_id;
  const dogData = req.body;

  try {

    const DogsOwnedByUser = await Pet.findAll({
      where: {
        user_id : userId
      }
    })


    console.log("지금 강아지 ", DogsOwnedByUser.length, "마리입니다!!..");
    if(DogsOwnedByUser.length >= MAX_DOG_PER_USER){
      return sendError(res, {errorMessage : "강아지는 3마리까지만 등록가능합니다."});
    }

    const newDog = await Pet.create({
      ...dogData,
      user_id: userId,
    });
    //TODO : 강강쥐 코드인지(A001로시작하는지 확인하는 미들웨어 )
//TODO : 선택된 강아지의 id값을 가져오는 middleward 필요함 
//TODO : feed_name 이거 거르는 코드 작성하기 
//TODO ; 
    const foodData = await FoodReport.create({
      pet_id : newDog.id,
      user_id: userId, 
      food_name : dogData.feed_name,
      food_time : dogData.feed_time
    })

    return sendResponse(res, {data : newDog, foodData }, {responseMessage : "Dog is Created successfully"})
  } catch (error) {
    console.error(error.message);
    const statusCode = error.status ?? 500;
    return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
  }
};

export const findAllDogs = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const dogs = await Pet.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'owner',
        },
      ],
    });

    return sendResponse(res, {data : {email : req.user.user_email,  dogs}});
  } catch (error) {
    console.error(error.message);
    const statusCode = error.status ?? 500;
    return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
  }
};

export const deleteGangG = async (res, req) => {

}; 

export const selectGangG = async (res, req) => {

};
