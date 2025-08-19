import Activity from '../models/activity.log.model.js';
import { sendResponse } from '../util/response.util.js';

//service logic 
import { getDogSlugIfNull, getuserToken } from '../services/activity.service.js';

const FITBARK_ACTIVITY_URL = "https://app.fitbark.com/api/v2/activity_series"

export const getHourlyValues = async(req, res, next) => {
try{
    const user = req.user;
    const petId = req.query.pet_id;
    const token = getuserToken(user.user_id, petId);
    const slugValue = await getDogSlugIfNull();
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