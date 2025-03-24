class DogController{



    static async createDog(dogData){

       try{
        const foundDog = await Pet.findOne({ where: { pet_name: dogData.pet_name } });

        if (foundDog) {
            throw new Error("This dog already exists.");
        }
 
        const newDog = await Pet.create(dogData);
        return newDog;
        
       }catch(error){
        console.error("Error while creating dog:", error.message);
        throw error;
       }
    }

    static async findDogs(userId){
        const petWithOwner = await Pet.findOne({
            where: { user_id : userId },  // 원하는 pet_name을 기준으로 조회
            include: [
              {
                model: User,
                as: 'owner',  // 'owner'라는 이름으로 Owner 모델을 포함
              }
            ]
          });
        
          return petWithOwner;

    }
}

export default DogController;
