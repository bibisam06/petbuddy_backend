import { sendError, sendResponse } from "../util/response.util.js";

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



export const returnWeatherGrade = async (req, res) => {
    const { lat, lon, city } = req.query;
    if (!lat || !lon) {
    return sendError(res, { errorMessage: "위치 정보가 없습니다." }, { responseCode: 400 });
    }

    try {
    const wedData = await getcurrentWeather(lat, lon, city);
    const airData = await getcurrentAirPollution(lat, lon);

    const weather = wedData.weather.main;
    const aqi = airData.list[0].main.aqi;
    const airQualityStatus = ['좋음', '보통', '나쁨', '매우 나쁨', '위험'][aqi - 1];
    console.log(aqi);    
    const totalScore = await calculateScore(breed, weather, aqi);
    sendResponse(
        res,
        { data: { "미세먼지" : airQualityStatus, "날씨" : weather, "적합도 " : totalScore },},
        { responseCode: 200 },
        { responseMessage: "산책 적합도 계산 성공" }
    );
    } catch (error) {
    console.error(error.message);
    const statusCode = error.status ?? 500;
    return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
};
