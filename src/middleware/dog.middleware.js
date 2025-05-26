import jwt from 'jsonwebtoken';
import sequelize from '../db/pgConnect.js';
import User from '../models/user.model.js';

export const petMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) {
        const error = new Error("Token is not found");
        error.status = 401;
        return next(error);
    }

    try {
        // JWT 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findOne({ where: { user_id: decoded.userId } });

        if (!user) {
            const error = new Error("User Not Found!");
            error.status = 404;
            return next(error);
        }

        req.user = user;

        const number = req.query.dogOrder || 1;

        const [results] = await sequelize.query(`
            SELECT *
            FROM (
                SELECT 
                    *, 
                    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY pet_id) AS row_num
                FROM Pet
            ) AS ranked
            WHERE user_id = :userId AND row_num = :rowNum
        `, {
            replacements: { userId: user.user_id, rowNum: number }
        });

        req.dog = results?.[0] || null;
        next();

    } catch (error) {
        console.error(error.message);
        const error1 = new Error("Unauthorized or Token Invalid");
        error1.status = 403;
        return next(error1);
    }
};
