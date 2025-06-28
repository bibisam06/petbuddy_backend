import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { UserNotFoundError, UnAuthorizedError } from '../error/const.error.js';
export const authenticateUser = async (req, res, next) => {
    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
        throw new UserNotFoundError();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findOne({ where: { user_id: decoded.userId } });

        if (!user) {
            throw new UserNotFoundError();
        }

        //next 
        req.token = token;
        req.user = user;
        next(); 
    } catch (error) {
        console.log("in jwt-middle ware");
        return next(error);
    }
}