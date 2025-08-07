import User from '../../models/user.model.js';
import Pet from '../../models/pet.model.js';
import { ForbiddenDogError, NoDogError, PetIdRequiredError } from '../../error/error.handler.js';

export const checkPetisRequestedUsers = async (req, res, next) => {
  try {
    console.log("=== checkPetisRequestedUsers 진입 ===");

    const user = req.user;
    const dogId = req.query.pet_id;

    if (!dogId) {
      throw new PetIdRequiredError('dog_id가 요청에 없습니다.');
    }

    const selectedDog = await Pet.findOne({
      where: { pet_id: dogId }
    });

    if (!selectedDog) {
      throw new NoDogError('해당 강아지를 찾을 수 없습니다.');
    }


    // 타입 변환은 Number() 함수로 반드시 호출
    const userIdNum = Number(user.user_id ?? user.id);
    const dogOwnerIdNum = Number(selectedDog.user_id);

    if (isNaN(userIdNum) || isNaN(dogOwnerIdNum)) {
      console.error('userIdNum 또는 dogOwnerIdNum 중 NaN 발생');
      throw new ForbiddenDogError('사용자 또는 강아지 소유자 정보가 올바르지 않습니다.');
    }

    //console.log('비교용 userIdNum:', userIdNum, ', dogOwnerIdNum:', dogOwnerIdNum);

    if (userIdNum !== dogOwnerIdNum) {
      console.log('접근 권한 없음: 사용자 ID와 강아지 소유자 ID가 다름');
      throw new ForbiddenDogError('접근 권한이 없는 강아지입니다.');
    }

    // 권한 통과
    console.log('권한 체크 통과: 다음 미들웨어 진행');
    next();

  } catch (error) {
    console.error('checkDogisRequestedUsers 에러:', error.message);
    next(error);
  }
};