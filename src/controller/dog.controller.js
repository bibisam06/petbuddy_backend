// controllers/dog.controller.js
//model - import
import Pet from '../models/pet.model.js';
import FeedReport from '../models/feed.log.model.js';
//middle-ware
import { sendResponse } from '../util/response.util.js';
import { DogRegistrationError, InternalServerError, InvalidRequestError, NoDogError } from '../error/error.handler.js';


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
      throw new DogRegistrationError();
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
      order: [['pet_id', 'ASC']]
    });

    if(!dogs){
      throw new NoDogError();
    }

  const results = await Promise.allSettled(
  dogs.map(async (dog) => {
    try {
      const feedData = await FeedReport.findOne({
      where: {
        pet_id: dog.pet_id,
        food_close_yn: false,
      },
      raw: false, 
      });

      if (feedData) {
        dog.dataValues.feed = feedData.food_id;
        dog.dataValues.foodGrade = feedData.food_remain_grade;
      } else {
        dog.dataValues.feed = null;
        dog.dataValues.foodGrade = null;
      }
    } catch (err) {
      throw err;
    }
  })
);

    console.log("results : ", results);

    return sendResponse(res, 
      {
        responseCode : 200,
        responseMessage : "강아지 조회 성공",
        data : {email : req.user.user_email,  dogs: dogs.map(dog => dog.dataValues)} 
      });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

export const deleteGangG = async (req, res, next) => {
  try{
    const selectedDog = req.query.dog;
    const selectedUser = req.user;
    console.log(req.user);
    const dog = await Pet.findOne({
      where: {
        pet_id: selectedDog,
        user_id: selectedUser.user_id
      }
    });

    if(!dog){
      throw new NoDogError("사용자에게 해당 강아지가 존재하지 않습니다!");
    }

    const result = await Pet.destroy({
      where : {
        pet_id : dog.pet_id
      }
    });

    console.log(result);

    if(result == 0){
      throw new InternalServerError("삭제에 실패했습니다");
    }

    return sendResponse(res, {
      responseCode : 200,
      responseMessage : "deleted dog",
      data : dog
    });

  }catch(error){
    console.error(error.message);
    next(error);
  }
}; 



export const editGangG = async (req, res, next) => {
try{
  console.log("여기1");
  const dogId = parseInt(req.query.pet_id);
  if(!dogId){
    return new NoDogError("강아지 아이디가 존재하지 않습니다");
  }

  console.log("여기2");
  const user = req.user;
  console.log(typeof dogId);

  console.log("여기3");
  const foundDog = await Pet.findOne({
    where : { 
      pet_id : dogId,
      user_id : user.user_id
    }
  });

  if(!foundDog){
    throw new NoDogError("사용자에게 해당 강아지가 존재하지 않습니다!");
  }
  const dogData = req.body;
  const result = await Pet.update(dogData, {
    where : { pet_id : dogId }
  });
  
  console.log(result);

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
