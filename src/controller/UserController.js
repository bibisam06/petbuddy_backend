import User from '../models/user.model.js';

class UserController {


    static async updateUserInfo(user, userData){
   
        const userId = user.user_id; 
        const founduser = await User.findOne({
            where: { email : user.email },
            attributes: ['email']
          });      

        if(!founduser){
            return new Error("There is No Valid User");
        }
     
        const result = await User.update(userData, {
            where: { user_id : userId }
          });
     
          return result;

    }
    
    static async update(user, userData){
        const userId = user.user_id; 
        const founduser = await User.findOne({
            where: { email : user.email },
            attributes: [ 'email']
          });      
        if(!founduser){
            return new Error("There is No Valid User");
        }
     
        const result = await User.update(userData, {
            where: { user_id : userId }
          });
         
          return result;
    }

    static async getUserData(user){
      console.log(user);
      const result = await User.findOne({
          where : { user_id : user.user_id }
        });
      return result;
    }
}

export default UserController;