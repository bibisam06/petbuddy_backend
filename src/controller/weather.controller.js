// utils.js
import { sendError, sendResponse } from "../util/response.util.js";
// models
import Pet from '../models/pet.model.js';
import PetSubCategory from "../models/pet.division2.model.js";
import { NoDogError } from "../error/error.handler.js";

// static Value
const API_KEY = process.env.OPENWEATHER_API_KEY;

const isSnowDog = (breed) => {
    const snowDogs = ['사모예드', '허스키', '말라뮤트'];
    return snowDogs.includes(breed);
};

export const getcurrentWeather = async(lat, lon, city) => {
    console.log(city);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=kr&lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(weatherUrl);
    const wedData = await response.json();
    console.log(wedData.weather);
    return wedData;
};

export const getcurrentAirPollution = async(lat, lon) => {
    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lang=kr&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(airUrl);
    const airData = await response.json();
    console.log(airData);
    return airData;
};

export const calculateScore = async(breed , weather, aqi ) => {

    //날씨 - 비
    if(weather.includes("Rain")){
        return "비추천";
    }

    if(weather.includes("Snow")){
        if(isSnowDog(breed)){
            return "추천";
        }
        else{
            return "비추천";
        }
    }

    if(weather.includes("Clouds") || weather.includes("Clear")){
        return "추천";
    }
    //미세먼지 

    if(aqi >= 3 ){
        return "비추천";
    }else{
        return "추천";
    }


}



export const returnWeatherGrade = async (req, res, next) => {
    try {
    const { lat, lon, city } = req.query;
    const dogId = req.query.pet_id;
    const user = req.user;

    if (!lat || !lon) {
    return sendError(res, { errorMessage: "위치 정보가 없습니다." }, { responseCode: 400 });
    }

    const dogData = await Pet.findOne({
        where : {
            pet_id : dogId,
            user_id : user.user_id
        }
    });

    // 강아지가 조회되지 않는 경우
    if(!dogData){
        throw new NoDogError("해당 정보를 가지는 강아지가 존재하지 않습니다.");
    }

    // 견종 정보 조회
    const BreedData = await PetSubCategory.findOne({
        where : {
            pet_division_2_code : dogData.division2_code
        }
    });

    const wedData = await getcurrentWeather(lat, lon, city);
    console.log("wedData is returned..", wedData);
    const airData = await getcurrentAirPollution(lat, lon);


    const weather = wedData.weather[0].description;
    const aqi = airData.list[0].main.aqi;
    const airQualityStatus = ['좋음', '보통', '나쁨', '매우 나쁨', '위험'][aqi - 1]; 
    
    const totalScore = await calculateScore(BreedData.pet_division_2_name, weather, aqi);
    return sendResponse(res, {
        responseCode : 200,
        responseMessage : "산책 적합도 업데이트 성공",
        data : {
            "미세먼지" : airQualityStatus,
            "날씨" : weather, 
            "적합도" : totalScore
        }
    });
    } catch (error) {
        console.error(error.message);
        next(error);
    }

};
