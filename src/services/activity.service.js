/*
TODO : 활동량 조회 전 AUTH 를 수행하는 서비스 로직입니다.
*/
//import
import axios from "axios";

//models
import Pet from '../models/pet.model.js';
import UserToken from '../models/user.token.model.js';

//service logic import
import { getUserCredentials } from "./bark.service.js";
import { NoDogError } from "../error/error.handler.js";

// Get Users Releated Dogs
const FITBARK_DOG_INFO = "https://app.fitbark.com/api/v2/dog_relations"
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

    return response.data.dog_slug; 
}catch(error){
    console.error(error.message);
    next(error);
}
};



export const getDogSlugIfNull = async(dogId) => {
try{
    const dogData = await Pet.findOne({
        where : { 
            pet_id : dogId
        },
        attributes : [ pet_slug]
    }); //pet _ slug 찾아보고, 없으면 아래로.. 

    let dog_slug;
    if(!dogData.pet_slug){
        dog_slug = this.getDogSlug(token, dogId);
    }else{
        dog_slug = dogData.pet_slug;
    }

    return dog_slug;
}catch(error){
    console.error(error.message);
    next(error);
}
};

// 토큰 필요함  
//TODO : todkkk todo 

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
    next(error);
}
};


