import sequelize from '../db/pgConnect.js';

export const petMiddleware = async (req, res, next) => {
    try {
        const number = req.query.dogOrder || 1;
        //TODO : 조회 시간 너무 오래걸리는 문제 
        const [results] = await sequelize.query(`
            SELECT *
            FROM (
                SELECT 
                    *, 
                    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY pet_id) AS row_num
                FROM Pet
            ) AS ranked
            WHERE user_id = 64 AND row_num = :rowNum
        `, {
            replacements: { rowNum: number }
        });

        req.dog = results?.[0] || null;
        next();

    } catch (error) {
        console.error(error.message);
        const error1 = new Error("DB or Middleware Error");
        error1.status = 500;
        return next(error1);
    }
};
