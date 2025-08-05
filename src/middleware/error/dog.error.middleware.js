import User from '../../models/user.model.js';
import Pet from '../../models/pet.model.js';
import { ForbiddenDogError, NoDogError, PetIdRequiredError } from '../../error/error.handler.js';

export const checkDogisRequestedUsers = async (req, res, next) => {
  try {
    console.log("이거 잘 들어오지...? ", req.user);

    const user = req.user;
    const dogId = req.query.dog_id;

    if (!dogId) {
      // pet_id가 없을 때 처리 (필요 시)
        throw new PetIdRequiredError();
    }

    const selectedDog = await Pet.findOne({
      where: {
        pet_id: dogId
      }
    });

    if (!selectedDog) {
      // 강아지 없는 경우 404
      throw new NoDogError('해당 강아지를 찾을 수 없습니다.');
    }

    if (selectedDog.user_id !== user.id) {
      // 다른 유저 강아지 접근 금지 403
      throw new ForbiddenDogError('접근 권한이 없는 강아지입니다.');
    }

    // 검증 통과: 다음 미들웨어로 진행
    next();

  } catch (error) {
    console.error(error.message);
    next(error);
  }
};
