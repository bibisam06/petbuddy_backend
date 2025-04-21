import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    console.log("여기");
    const authHeader = req.headers['authorization'];
    console.log("여기");
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>" → <token>
    console.log("여기");
    console.log(token);
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