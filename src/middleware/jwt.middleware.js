import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) {
        const error = new Error("Token is not found");
        error.status = 404;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findOne({ where: { user_id: decoded.userId } });

        if (!user) {
            const error = new Error("User Not Found!");
            error.status = 404;
            return next(error);
        }

        req.user = user;
        
        next(); 
    } catch (error) {
        console.error(error.message);
        // const statusCode = error.status ?? 500;
        return next(error);
    }
}