import Activity from '../models/activity.log.model.js';
import { sendResponse } from '../util/response.util.js';

export const saveActivity = async (req, res, next) => {
try{
    const hourly_data = req.body.hourly_steps;
    const activityDatas = JSON.stringify(hourly_data);

    //create
    const result = await Activity.create({
        pet_id : req.query.pet_id,
        user_id : req.user.user_id,
        activity_date : req.body.date,
        activity_hourly_steps : activityDatas
    });

    return sendResponse(res, {
        responseCode : 201,
        responseMessage : "created..(testing)",
        data : activityDatas
    });

}catch(error){
    console.error(error);
    console.error(error.message);
    next(error);
}
};


export const getMonthlyActivity = async (req, res, next) => {
try{

}catch(error){
    console.error(error.message);
    next(error);
}
};