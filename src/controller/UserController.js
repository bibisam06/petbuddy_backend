
class UserController {


    static async updateUserInfo(user, userData){
        const userId = user.id; 
        const founduser = await User.findOne({
            where: { email },
            attributes: ['id', 'email']
          });      
        if(!founduser){
            return new Error("There is No Valid User");
        }
     
        const result = await User.update(userData, {
            where: { userId }
          });

    }
    
    static async update(user, userData){
        const userId = user.id; 
        const founduser = await User.findOne({
            where: { email },
            attributes: ['id', 'email']
          });      
        if(!founduser){
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