import { sendResponse } from "../utils/responseHandler.js";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export const getcurrentWeather = async(lat, lon, city) => {
    console.log(city);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lang=kr&lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    console.log(data.weather);
    return data;
};

export const getcurrentairPolution = async(lat, lon) => {
    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lang=kr&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(airUrl);
    const data = await response.json();
    console.log(data);
    return data;
};

export const returnWeatherGrade = async(req,res)=> {
    const { lat, lon , city} = req.query;
    try{
        const wedData = getcurrentWeather(lat, lon, city);
        const airData = getcurrentairPolution(lat, lon);

        const returnData = {
            // wedData.weather,

        } //TODO : data에서 빈 값으로 나오는 문제 
        sendResponse(res, { data : {wedData, airData}}, {responseCode : 200 }, { responseMessage : "산책 적합도 계산 성공"})
    }catch(error){
        console.error(error.message);
            const statusCode = error.status ?? 500;
            return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
};