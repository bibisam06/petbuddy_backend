//utils
import { sendResponse } from '../util/response.util.js';
//models
import Pet from '../models/pet.model.js';
import PooAnalysis from '../models/poo.log.model.js';

export const createPooLog = async (req, res, next) => {
  try {
    // 파일 없는 경우 예외처리
    if (!req.file) {
        throw new NoFileDetectedError();
    }

    const pooData = req.body;
    console.log('body .. : ', pooData);

    // 반려동물 정보 조회
    const dogData = await Pet.findOne({
        where: { pet_id: req.body.pet_id },
    });

    if (!dogData) {
    throw new NoDogError();
    }

    console.log('dog is ...', dogData);

    // 분석 결과 저장
    const result = await PooAnalysis.create({
      poop_date: new Date(), // 현재 시간
    ...pooData,
    user_id: dogData.user_id,
      poop_url: req.file.location, // S3 업로드된 URL
    });

    return sendResponse(res, {
    responseCode: 200,
    responseMessage: '사진을 업로드했습니다.',
      data: result, // 또는 req.file.location만 넘겨도 됨
    });
    } catch (error) {
    console.error(error);
    next(error);
    }
};