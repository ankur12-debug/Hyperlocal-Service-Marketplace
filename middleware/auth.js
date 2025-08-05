//It's a middleware that check the user is user/provider/admin (means vaild person) and then provide role based access by the help of 'authorize' variable;
import jwt from 'jsonwebtoken';
const { verify } = jwt;

//protected routes
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Not authorized, invalid token format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return res.status(401).json({ message: 'Token failed' });
    }
}
protect.displayName = "JWTProtectMiddleware";

//role based access
const authorize =(...roles) =>{
    return (req, res, next)=>{
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user?.role || 'unknown'} not authorized` });
        }
        next();
    };
};
authorize.displayName = "RoleAuthorizeMiddleware";

export { protect, authorize };