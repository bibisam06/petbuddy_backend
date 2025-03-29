
class UserController {


    static async updateUserInfo(user, userData){
        const userId = user.id; 
        const foundUser = await user.findOne({userId}); 
        if(!foundUser){
            return new Error("There is No Valid User");
        }
     
        const result = await User.update(userData, {
            where: { userId }
          });

    }
    
    static async update(user, userData){
        const userId = user.id; 
        const foundUser = await User.findOne({userId}); 
        if(!foundUser){
            return new Error("There is No Valid User");
        }
     
        const result = await User.update(userData, {
            where: { userId }
          });
    }

    static async getUserData(user){
        
    }
}

export default UserController;