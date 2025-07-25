import dayjs from 'dayjs';
import sequelize from '../db/pgConnect.js';
import {  Op } from 'sequelize';

//utils
import { sendResponse } from '../util/response.util.js';
import { deleteS3Folder } from '../util/S3delete.js';
//models
import Pet from '../models/pet.model.js';
import PooAnalysis from '../models/poo.log.model.js';
import { DateError } from '../error/error.handler.js';

//errors 
import { InvalidRequestError, NoFileDetectedError, NoDogError } from '../error/error.handler.js';


export const createPooLog = async (req, res, next) => {
  try {
    console.log("router");
    // 파일 없는 경우 예외처리
    if (!req.file) {
        throw new NoFileDetectedError();
    }

    const pooData = req.body;

    console.log(pooData);
    // 반려동물 정보 조회
    const dogData = await Pet.findOne({
        where: { pet_id: req.body.pet_id },
    });

    console.log("저장 요청하는 데이터입니다 : ", dogData);

    if (!dogData) {
    throw new NoDogError();
    }

    // 분석 결과 저장
    const result = await PooAnalysis.create({
      poop_date: new Date(), // 현재 시간
    ...pooData,
    user_id: req.user.user_id,
      poop_url: req.file.location, // S3 업로드된 URL
    });

    console.log("router ended");
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

export const getMonthlyCode = async (req, res, next) => {
try{
  const month = req.query.month;

    // 유효성 체크
    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      throw new DateError();
    }

    const startDate = `${month}-01`;
    const endDate = dayjs(startDate).endOf('month').format('YYYY-MM-DD');

    const result = await PooAnalysis.findAll({
      where: {
        poop_date: {
          [Op.between]: [startDate, endDate]
        },
        pet_id : req.query.dog_id
      },
      attributes: ['poop_date', 'poop_grade_total']
    });

    return sendResponse(res, {
      responseCode : 200,
      responseMessage : "데이터 조회 성공",
      data : result
    })

}catch(error){
  console.error(error.message);
  next(error);
}
};


export const getDailyCode = async (req, res, next) => {
try{
  const petId = req.query.dog_id;
  const date = req.query.date;
  const inputDate = new Date(date); 

  if(!petId || !date){
    throw new InvalidRequestError();
  }

  console.log(date);
  const foundData = await PooAnalysis.findAll({
    where : {
      poop_date : inputDate,
      pet_id : petId
    },
    attributes : ['poop_date', 'poop_url', 'poop_score_total', 'poop_score_moisture', 'poop_score_color', 'poop_score_parasite']
  });
  console.log(foundData);

  return sendResponse(res, {
    responseCode : 200,
    responseMessage : "조회 성공",
    data : foundData
  });
}catch(error){
  console.error(error.message);
  next(error);
}
};


export const getMonthsMean = async(req, res, next) => {
try{
  const dogId = req.query.dog_id;
  const month = req.query.month;

   // 유효성 체크
    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      throw new DateError();
    }

    const startDate = `${month}-01`;
    const endDate = dayjs(startDate).endOf('month').format('YYYY-MM-DD');

const result = await sequelize.query(`
  SELECT DISTINCT ON (poop_date)
    poop_date,
    poop_url,
    poop_score_total,
    poop_score_moisture,
    poop_score_color,
    poop_score_parasite,
    poop_grade_total
  FROM "poop_log"
  WHERE pet_id = :dogId AND poop_date BETWEEN :startDate AND :endDate
  ORDER BY poop_date, poop_log_id DESC
`, {
  replacements: { dogId, startDate, endDate },
  type: sequelize.QueryTypes.SELECT
});

    const poopScoreList = result.map(item => ({
      date: item.poop_date,
      grade: item.poop_grade_total
    }));

    const totalScore = result.reduce((acc, result) => acc + result.poop_score_total, 0);
    const totalMoisture = result.reduce((acc, result) => acc + result.poop_score_moisture, 0);
    const totalColor = result.reduce((acc, result) => acc + result.poop_score_color, 0);
    const totalParasite = result.reduce((acc, result) => acc + result.poop_score_parasite, 0);

    const count = result.length;
    //const - average scores 
    const average = count === 0 ? null : Math.round(totalScore / count);
    const averateMoisture = count === 0? null : Math.round(totalMoisture / count);
    const averateColor = count === 0? null : Math.round(totalColor / count);
    const averatePrasite = count === 0? null : Math.round(totalParasite / count);

    return sendResponse(res, {
      responseCode : 200,
      responseMessage : "한달 평균값 계산 완료",
      data : {
        monthly_poop_list : poopScoreList,
        poop_score_total : average,
        poop_score_moisture : averateMoisture,
        poop_score_color : averateColor,
        poop_score_parasite : averatePrasite
      }
    });
}catch(error){
  console.error(error.message);
  next(error);
}
};


export const deletePooPictures = async(req, res, next) => {
try{

  console.log("여기1");
  const dogOrder = req.query.pet_id;
  console.log("강아지 아이디 : ", dogOrder);
  console.log(typeof dogOrder);

  console.log("여기2");

  console.log("여기3");


  const reqUser = req.user.user_id;
    const dogPrefix = "user_"+ reqUser +"/dog_" +dogOrder;
    console.log("강아지 접두어 : " , dogPrefix);
    console.log(typeof dogPrefix);

  const result = deleteS3Folder(dogPrefix);
  console.log("여기4");
  console.log(result);

  console.log("here!! last ..... finally .....");
  return sendResponse(res, {
      responseCode : 200,
      responseMessage : "deleted poo.. pictures",
      data : null
    });
}catch(error){

  console.log("error occured...");
  console.error(error.message);
  next(error);
}
}