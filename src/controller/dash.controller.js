import { NoDogError } from '../error/error.handler.js';
import { sendResponse } from '../util/response.util.js';
import Pet from '../models/pet.model.js';

export const getDashBoard = async (req, res, next) => {
    try {
        const user = req.user;
        const dogId = req.query.pet_id;
        console.log("강아지 아이디", dogId);

        const dog = await Pet.findOne({
            where : {
                pet_id : dogId,
                user_id : user.user_id
            }
        });

        if (!dog) {
            throw new NoDogError();
        }

        return sendResponse(res,
            {
                responseCode : 200,
                responseMessage : "대쉬보드 정보 조회",
                data: {
                    pet_walk : 0.0,
                    poop_score_total : 0.0,
                    pet_sleep : 0.0,
                    pet_feed: 0.0
                }
            },
        );
    } catch (error) {
        console.error(error.message);
        next(error);
    }
};


