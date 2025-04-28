import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>" → <token>
    
    if (!token) return res.status(401).json({ message: 'No token provided for validator' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findOne({ where: { user_id: decoded.userId } });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

         req.user = user;
        
        next(); 
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token is expired' });
    }
}