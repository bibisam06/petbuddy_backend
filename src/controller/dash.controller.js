import { sendError, sendResponse } from '../util/response.util.js';
import {
    calculateScore,
    getcurrentAirPollution,
    getcurrentWeather
} from './weather.controller.js';

export const getDashBoard = async (req, res) => {
    try {
        const dog = req.dog;
        const { lat, lon, city } = req.query;

        if (!dog) {
            const nodogError = new Error("선택한 강아지 정보를 확인 할 수 없습니다.");
            nodogError.status = 404;
            throw nodogError;
        }

        let weatherInfo = null;

        if (lat && lon && city) {
            const wedData = await getcurrentWeather(lat, lon, city);
            const airData = await getcurrentAirPollution(lat, lon);

            const weather = wedData.weather[0].main;
            const aqi = airData.list[0].main.aqi;
            const airQualityStatus = ['좋음', '보통', '나쁨', '매우 나쁨', '위험'][aqi - 1];

            const totalScore = await calculateScore(dog.breed, weather, aqi);

            weatherInfo = {
                날씨: weather,
                미세먼지: airQualityStatus,
                적합도: totalScore
            };
        }

        return sendResponse(res,
            {
                responseCode : 200,
                responseMessage : "대쉬보드 정보 조회",
                data: {
                    dog, //TODO : weatherInfo 적합도 null 로 나오는 문제 
                    weatherInfo: weatherInfo 
                }
            },
        );
    } catch (error) {
       const statusCode = error.status || 500;
    console.error(error.message);
    return sendError(res, {
            errorMessage: error.message,
            responseCode: statusCode
    });
    }
};


