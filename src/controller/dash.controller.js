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
            return sendError(res, { errorMessage: "반려견 정보가 없습니다." }, { responseCode: 404 });
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
                data: {
                    dog, //TODO : weatherInfo 적합도 null 로 나오는 문제 
                    weatherInfo: weatherInfo 
                }
            },
            { responseMessage: "대시 보드 조회 성공" }
        );
    } catch (error) {
        console.error(error.message);
        const statusCode = error.status ?? 500;
        return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
};


