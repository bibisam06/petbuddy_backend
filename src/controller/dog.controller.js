// controllers/dog.controller.js
//model - import
import Pet from '../models/pet.model.js';
import FeedReport from '../models/feed.log.model.js';
//middle-ware
import { sendResponse } from '../util/response.util.js';
import { NoDogError } from '../error/error.handler.js';

const MAX_DOG_PER_USER = 3;


export const createDog = async (req, res, next) => {
  const userId = req.user.user_id;
  const dogData = req.body;
  try {

    if(!dogData){
      throw new NoDogError();
    }

    // consts 
    const grade = req.grade;
    const remain_amount = req.remains;
    const remain_days = req.days;
    const required = req.required;


    const DogsOwnedByUser = await Pet.findAll({
      where: {
        user_id : userId
      }
    });

    console.log("지금 강아지 ", DogsOwnedByUser.length, "마리입니다!!..");
    if(DogsOwnedByUser.length >= MAX_DOG_PER_USER){
      const dogError = new Error("강아지는 3마리까지 등록가능합니다");
      dogError.status = 400;
      throw dogError;
    }

    const newDog = await Pet.create({
      ...dogData,
      user_id: userId,
    });

    console.log(grade);
    const foodData = await FeedReport.create({
      pet_id : newDog.pet_id,
      user_id: userId, 
      food_id : dogData.feed_id,
      food_name : dogData.feed_name,
      food_remain_amount : remain_amount,
      food_remain_days : remain_days,
      food_remain_grade : grade,
      food_required_amount : required
    });

    return sendResponse(res, { 
        responseCode : 200,
        responseMessage : "새로운 강아지가 등록되었습니다.",    
        data: {newDog, foodData}
    });
  } catch (error) {
    const statusCode = error.status || 500;
    console.error(error.message);
    next(error);
  }
};

export const findAllDogs = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const dogs = await Pet.findAll({
      where: { user_id: userId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if(!dogs){
      throw new NoDogError();
    }

  await Promise.all(
  dogs.map(async (dog) => {
    const feedData = await FeedReport.findOne({
      where: {
        pet_id: dog.pet_id,
        food_close_yn: false,
      },
      raw: false, 
    });

    console.log(feedData?.dataValues); // 확인

    if (feedData) {
      dog.dataValues.feed = feedData.dataValues.food_id;
      // dog.dataValues.foodRemainDays = feedData.dataValues.food_remain_days;
      // dog.dataValues.foodRemains = feedData.dataValues.food_remain_amount;
      dog.dataValues.foodGrade = feedData.dataValues.food_remain_grade;
    } else {
      dog.dataValues.feed = null;
      dog.dataValues.foodRemainDays = null;
      dog.dataValues.foodRemains = null;
    }
  })
);

    return sendResponse(res, 
      {
        responseCode : 200,
        responseMessage : "강아지 조회 성공",
        data : {email : req.user.user_email,  dogs: dogs.map(dog => dog.dataValues)} //TODO : dogs 반환하는 방식 변경 -> 알아두기 
      });
  } catch (error) {
    const statusCode = error.status || 500;
    console.error(error.message);
    next(error);
  }
};

export const deleteGangG = async (req, res, next) => {
  try{
    const selectedDog = req.dog;

    console.log(selectedDog);
    await Pet.destroy({
      where : { pet_id : selectedDog.pet_id }
    });

    return sendResponse(res, {
      responseCode : 200,
      responseMessage : "deleted dog",
      data : selectedDog
    });

  }catch(error){
    console.error(error.message);
    next(error);
  }
}; 


export const editGangG = async (req, res, next) => {
try{
  const dogId = req.dog.pet_id;
  const foundDog = await Pet.findOne({
    where : { pet_id : dogId }
  });

  console.log(foundDog);
  if(!foundDog){
    throw new NoDogError();
  }
  const dogData = req.body;
  const result = await Pet.update(dogData, {
    where : { pet_id : dogId }
  });
  

  return sendResponse(res, {
    responseCode : 200, 
    responseMessage : "강아지 정보가 업데이트 되었습니다",
    data : dogData
  });

}catch(error){
  console.error(error.message);
  next(error);
}
};
