// model import 

import Pet from '../../models/pet.model.js';

// middle-ware = utils 
import { sendResponse } from '../../util/response.util.js';


export const getMyDogs = async (req, res, next) => {
try {
    const userId = req.user.user_id;

    const dogs = await Pet.findAll({
    where: { user_id: userId },
    attributes: { exclude: ['created_at', 'updated_at', 'pet_slug'] },
    order: [['pet_id', 'ASC']]
    });

    if (!dogs || dogs.length === 0) {
    throw new NoDogError();
    }

    const results = await Promise.allSettled(
    dogs.map(async (dog) => {
        try {
        const feedData = await FeedReport.findOne({
            where: {
            pet_id: dog.pet_id,
            food_close_yn: false,
            },
            raw: false,
        });

        if (feedData) {
            dog.dataValues.feed = feedData.food_id;
            dog.dataValues.foodGrade = feedData.food_remain_grade;
        } else {
            dog.dataValues.feed = null;
            dog.dataValues.foodGrade = null;
        }
        } catch (err) {
        throw err;
        }
    })
    );

    // 결과 반환 예시
    return sendResponse(res, {
        responseCode: 200,
        responseMessage: "강아지 조회 성공",
        data: {
        email: req.user.user_email,
        dogs: dogs
    }
    });
} catch (err) {
    next(err);
}
};