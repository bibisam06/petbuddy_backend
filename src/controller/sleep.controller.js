import axios from "axios";

// service import
import { getDogSlugIfNull, getuserToken } from "../services/activity.service.js";

// utils 
import { sendResponse } from '../util/response.util.js';

const FITBARK_SLEEP_URL = "https://app.fitbark.com/api/v2/"
export const getHourlySleepStatus= async(req, res, next) => {
try{
    const userId = req.user.user_id;
    const petId = req.query.pet_id;
    const today = new Date();

    const token = await getuserToken(userId, petId);
    const slugValue = await getDogSlugIfNull(petId, token);

    const response = await axios.post()

return sendResponse(res, {
    responseCode : 200,
    responseMessage : "test done",
    data : null
})
}catch(error){
    console.error(error.message);
    next(error);
}
};