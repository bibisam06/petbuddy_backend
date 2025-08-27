// model import
import User from '../models/user.model.js';


export const getAllUsers = async () => {
try {
    const allUsers = await User.findAll({
        attributes : ['user_id']
    }); 
    return allUsers;
} catch (error) {
    console.error(error.message);
    throw error;
}
};