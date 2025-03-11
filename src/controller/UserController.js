
class UserController {


    static async updateUserInfo(userId, userData){
        
        const foundUser = await User.findOne({userId}); 
        if(!foundUser){
            return new Error("There is No Valid User");
        }
        //TODO : update치는거 나중에 수정하기
        const result = await User.update(newData, {
            where: { userId }
          });
    }
    
}

export default UserController;