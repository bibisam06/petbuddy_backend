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
}

export default DogController;
