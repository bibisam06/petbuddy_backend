import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    const token = req.headers.jwt_token?.split(' ')[0]; 

    //TODO : token 값 undefined 로 들어오는 문제발생 
    if (!token) return res.status(401).json({ message: 'No token provided for validator' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next(); 
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token is expired' });
    }
}