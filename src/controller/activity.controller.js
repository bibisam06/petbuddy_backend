//models
import Activity from '../models/activity.log.model.js';

//utils
import { sendResponse } from '../util/response.util.js';

//service logic 
import { getDogSlugIfNull, getuserToken } from '../services/activity.service.js';
// import 
import axios from 'axios';

const FITBARK_ACTIVITY_URL = "https://app.fitbark.com/api/v2/activity_series"

/*
{
   "activity_series":{
           "slug":"c3e770f4-4b23-422f-b7a7-7e82873c1b64",
           "from":"2016-04-20",
           "to":"2016-04-25",
           "resolution":"DAILY"
   }
}
*/
export const getHourlyValues = async(req, res, next) => {
try{
    const user = req.user;
    const petId = req.query.pet_id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const token = getuserToken(user.user_id, petId);
    const slugValue = await getDogSlugIfNull(token);

    const response = await axios.post(
        FITBARK_ACTIVITY_URL,
        {
            slug : slugValue,
            from : startDate,
            to : endDate,
            resolution : "HOURLY"
        },
        {
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
        }
    );


    //response 가공 후 리턴 예정 

    console.log("result is .. : ", result);

    sendResponse(res, {
        responseCode : 200,
        responseMessage : "successed..",
        data : result //TODO : 일단 널

    });
}catch(error){
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