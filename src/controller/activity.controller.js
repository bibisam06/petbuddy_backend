//models
import Activity from '../models/activity.log.model.js';
import Pet from '../models/pet.model.js';

//utils
import { sendResponse } from '../util/response.util.js';
import { startPetDataScheduler1 } from '../scheduler/activity.scheduler.js';

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
    const today = new Date();

    const token = await getuserToken(user.user_id, petId); 
    const slugValue = await getDogSlugIfNull(petId, token);

    const response = await axios.post(
    FITBARK_ACTIVITY_URL,
    {
    activity_series: {
        slug: slugValue,
        from: today.toDateString(),
        to: today.toDateString(),
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

    sendResponse(res, {
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
    const user = req.user;
    const petId = req.query.pet_id;

}catch(error){
    console.error(error.message);
    next(error);
}
};


export const getMonthlyActivityMean = async(req, res, next) => {
try{

}catch(error){
    console.error(error.message);
    next(error);
}
};


//배치 테스트 중입니다 

export const testScheduler = async(req, res, next) => {
try{

    const response = startPetDataScheduler1();

return sendResponse(res, {
    responseCode : 200,
    responseMessage : "test done",
    data : response
})
}catch(error){
    console.error(error.message);
    next(error);
}
};