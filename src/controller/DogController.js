import Pet from '../models/pet/pet.model.js';
import User from '../models/user.model.js';

class DogController {
  /**
   * 강아지 등록
   * @param {Object} dogData - 강아지 정보
   * @param {number} userId - 사용자 ID (FK)
   * @returns {Promise<Object>} 생성된 강아지 데이터
   */
  static async createDog(userId, dogData) {
    try {
      console.log(dogData);
      const existingDog = await Pet.findOne({
        where: {
          pet_name: dogData.pet_name,
          user_id: userId
        }
      });

      if (existingDog) {
        throw new Error("This dog already exists for this user.");
      }

      const newDog = await Pet.create({
        ...dogData,
        userId
      });

      return newDog;

    } catch (error) {
      console.error("Error while creating dog:", error.message);
      throw error;
    }
  }

  /**
   * 사용자별 강아지 조회
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Object>} 사용자와 연결된 강아지 데이터
   */
  static async findAllDogs(userId) {
    try {
      const petWithOwner = await Pet.findAll({
        where: { userId }, // user_id → userId 수정
        include: [
          {
            model: User,
            as: 'owner'
          }
        ]
      });

      return petWithOwner;

    } catch (error) {
      console.error("Error while finding dogs:", error.message);
      throw error;
    }
  }
}

export default DogController;
