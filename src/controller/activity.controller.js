import Activity from '../models/activity.log.model.js';
import { sendResponse } from '../util/response.util.js';


const FITBARK_ACTIVITY_URL = "https://app.fitbark.com/api/v2/activity_series"

export const getHourlyValues = async(req, res, next) => {
try{

}catch(error){
    console.error(error.message);
    next(error);
}
};


export const getDailyValues = async(req, res, next) => {
try{

}catch(error){
    console.error(error.message);
    next(error);
}
};