/*
TODO : 활동량 조회 전 AUTH 를 수행하는 서비스 로직입니다.
*/
//import
import axios from "axios";

//models
import Pet from '../models/pet.model.js';
import UserToken from '../models/user.token.model.js';
import Activity from "../models/activity.log.model.js";

//service logic import
import { getUserCredentials } from "./bark.service.js";
import { NoDogError } from "../error/error.handler.js";
import { token } from "morgan";

// Get Users Releated Dogs
const FITBARK_DOG_INFO = "https://app.fitbark.com/api/v2/dog_relations"
const FITBARK_ACTIVITY_URL = "https://app.fitbark.com/api/v2/activity_series"
export const getDogSlug = async(token) => {
try{

    const response = await axios.get(
        FITBARK_DOG_INFO,
        {
            headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
        }
    );

    const slug = response.data.dog_relations[0].dog.slug;
    return slug;
}catch(error){
    console.error(error.message);
    throw error;
}
};



export const getDogSlugIfNull = async(petId, token) => {
try{
    const dogData = await Pet.findOne({
        where : { 
            pet_id : petId
        },
        attributes : [ 'pet_slug' ]
    }); 

    let dog_slug;
    if(!dogData.pet_slug){
        dog_slug = await getDogSlug(token);
            await Pet.update(
            { 
                pet_slug: dog_slug ,
                pet_device_connected : true
            }, 
            {
                where: {
                pet_id: petId
                }
            }
            );
            
    }else{
        dog_slug = dogData.pet_slug;
    }

    return dog_slug;
}catch(error){
    console.error(error.message);
    throw error; 
}
};


export const getuserToken = async(user_id, pet_id) => {
    // 조회만 하고 없으면 에러처리 -> 클라이언트 연동 유도 
try{
    const result = await UserToken.findOne({
        where : {
            user_id : user_id,
            pet_id : pet_id
        },
        attributes : ['user_token']
    });
    const user_token = result.user_token;
    if(!user_token){
        throw new NoDogError('해당 사용자가 핏바크 연동된 상태가 아닙니다. 연동을 먼저 진행시켜주시기 바랍니다.');
    }
    return user_token;
}catch(error){
    console.error(error.message);
    throw error;
}
};


export const savePetDailyData = async(user, pet) => {
try{
    const today = new Date();
    const userId = user.user_id;
    const petId = pet.pet_id;

    const tokenResult = await UserToken.findOne({
        where : {
            user_id : userId, 
            pet_id : petId 
        },
        attributes : ['user_token']
    });

    const userToken = tokenResult.user_token; 
    if(!userToken){
        throw new NoDogError("기기 연동이 되지 않은 강아지입니다.");
    }

    const dogSlug = await getDogSlugIfNull(petId, tokenResult.user_token);
    const records = await getDogActivity(dogSlug, userToken);

    const activityArray = records.map(r => ({
    time: r.date,
    steps: r.avtivity_value,
    }));


    const result = await Activity.create({
        pet_id : petId,
        user_id : userId,
        activity_date : "2025-08-12", //기본 오늘로 
        activity_hourly_steps : activityArray
    });
    return result; 
}catch(error){
    console.error(error.message);
    throw error;
}
};

export const getDogActivity = async(dogSlug, token) => {
try{
    const today = new Date();
    const response = await axios.post(
    FITBARK_ACTIVITY_URL,
    {
    activity_series: {
        slug: dogSlug,
        from: "2025-08-12",
        to: "2025-08-12",
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


    console.log("result is ", result);

    return result;

}catch(error){
    console.error(error.message);
    throw error;
}
};