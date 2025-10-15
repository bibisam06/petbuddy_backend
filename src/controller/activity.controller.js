//models
import Activity from '../models/activity.log.model.js';
import Pet from '../models/pet.model.js';
import User from '../models/user.model.js'; 

//utils
import { sendResponse } from '../util/response.util.js';

//service logic 
import { getDogSlugIfNull, getuserToken } from '../services/activity.service.js';
// import 
import axios from 'axios';

const FITBARK_ACTIVITY_URL = "https://app.fitbark.com/api/v2/activity_series"
export const getHourlyValues = async(req, res, next) => {
try {
    //param 값 받아오기 
    const user = req.user;
    const petId = req.query.pet_id;
    const formatted = new Date().toISOString().split('T')[0];
    console.log(formatted); 

    const token = await getuserToken(user.user_id, petId);
    
    if(!token){
        throw new NoDogError('해당 사용자가 핏바크 연동된 상태가 아닙니다. 연동을 먼저 진행시켜주시기 바랍니다.');
    }
    const slugValue = await getDogSlugIfNull(petId, token);

    const response = await axios.post(
    FITBARK_ACTIVITY_URL,
    {
    activity_series: {
        slug: slugValue,
        from: formatted,
        to: formatted,
        resolution: "HOURLY"
        }
    },
    {
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    }
);

    const result = response.data.activity_series.records;

    return sendResponse(res, {
    responseCode: 200,
    responseMessage: "successed..",
    data: result
    });
} catch (error) {
    console.error(error.message);
    next(error); 
}
};

export const getDailyValues = async(req, res, next) => {
try{
    //param 값 받아오기 
    const user = req.user;
    const petId = req.query.pet_id;
    const formatted = new Date().toISOString().split('T')[0];
    console.log(formatted); // 2025-08-12

    const token = await getuserToken(user.user_id, petId); 
    const slugValue = await getDogSlugIfNull(petId, token);

    const response = await axios.post(
    FITBARK_ACTIVITY_URL,
    {
    activity_series: {
        slug: slugValue,
        from: formatted,
        to: formatted,
        resolution: "DAILY"
        }
    },
    {
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    }
);

    const result = response.data.activity_series.records;

    return sendResponse(res, {
    responseCode: 200,
    responseMessage: "successed..",
    data: result
    });

}catch(error){
    console.error(error.message);
    next(error);
}
};


export const getMonthlyActivityMean = async(req, res, next) => {
try{

    sendResponse(res, {
    responseCode: 200,
    responseMessage: "successed..",
    data: null
    });
}catch(error){
    console.error(error.message);
    next(error);
}
};


export const saveUserSteps = async(req, res, next) => {
try{
    const user = req.user;
    const newSteps = req.body.step; 


    const result = await User.update(
    { user_steps: newSteps },          // 수정할 데이터
    { where: { user_id: user.user_id } } // 조건
    );

    sendResponse(res, {
    responseCode: 200,
    responseMessage: "successed..",
    data: newSteps
    });
}catch(error){
    console.error(error.message);
    next(error);
}
};


export const getUserSteps = async(req, res, next) => {
try{

    const user = req.user; 
    const steps = await User.findOne({
        where : {
            user_id : user.user_id
        },
        attributes : ['user_steps']
    });

    const value = steps.dataValues.user_steps

    console.log(value);
    sendResponse(res, {
    responseCode: 200,
    responseMessage: "successed..",
    data: value
    });
}catch(error){
    console.error(error.message);
    next(error);
}
};