import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { UserNotFoundError } from '../error/error.handler.js';
export const authenticateUser = async (req, res, next) => {
    try {

        console.log("jwt authentication start");
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
        throw new UserNotFoundError();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded); 
        
        const user = await User.findOne({ where: { user_id: decoded.userId } });

        if (!user) {
            throw new UserNotFoundError();
        }

        console.log(user);
        //next 
        req.token = token;
        req.user = user;

        console.log("jwt authentication ended");
        next(); 
    } catch (error) {
        console.log("in jwt-middle ware");
        return next(error);
    }
}