import jwt from 'jsonwebtoken';

export default function verifyJWT(req, res, next) {
    const authHeader = req.headers['authorization'];    
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'Token de autenticação ausente.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                auth: false,
                message: 'Token inválido ou expirado.'
            });
        }

        req.userUUID = decoded.userUUID;
        req.userEmail = decoded.email;
        req.companyUUID = decoded.companyUUID;
        req.userRole = decoded.cargo;

        next();
    });
}