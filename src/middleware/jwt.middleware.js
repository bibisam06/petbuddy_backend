import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { UserNotFoundError } from '../error/error.handler.js';
export const authenticateUser = async (req, res, next) => {
    try {
        console.log("1. jwt authentication start");
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
        throw new UserNotFoundError("해당 사용자가 존재하지 않습니다.");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        console.log("who requested is ", userId);
        
        const user = await User.findOne({ where: { user_id: userId} });

        if (!user) {
            throw new UserNotFoundError("해당 사용자가 존재하지 않습니다.");
        }

        //next 
        req.token = token;
        req.user = user;

        console.log("2. jwt authentication ended");
        next(); 
    } catch (error) {
        console.log("in jwt-middle ware");
        return next(error);
    }
};