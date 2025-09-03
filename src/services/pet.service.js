// model import 
import { canTreatArrayAsAnd } from 'sequelize/lib/utils';
import Pet from '../models/pet.model.js';

export const getLinkedPets = async() => {
try{
    const allLinkedPets = await Pet.findAll({
        where : {
            pet_device_connected : true 
        },
        attributes : ['pet_id']
    });

    return allLinkedPets;
}catch(error){
    console.error(error.message);
    throw error;
}
};