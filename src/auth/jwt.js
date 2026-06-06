import jwt from 'jsonwebtoken';
import ApiError from '../middlewares/ErrorHandler';

export  function signToken(payload, secret, expiresIn = '1h') {
    return  jwt.sign(payload, secret, { algorithm:'HS256' ,expiresIn });
}   

// export  function verifyToken(token, secret) {
//     try {
//         const decoded =  jwt.verify(token, secret, { algorithms: ['HS256'] });
//         const tenantId = decoded.tenantId || decoded.sub;
//         if (!tenantId) {
//             throw new ApiError(401, 'Invalid token: tenantId missing');
//         }
//         const role = decoded.role || [];
//         if(!role.includes('worknook:write') && !role.includes('admin')) {
//             throw new ApiError(403, 'Forbidden: insufficient permissions');
//         }
//         return { tenantId, role, sub: decoded.sub, exp:decoded.exp };

//     } catch (err) {
//         if (err.name === 'TokenExpiredError') {
//             throw new ApiError(401, 'Token expired');
//         }   
//         if (err instanceof ApiError) {
//             throw err;
//         }
//         throw new ApiError(401, 'Invalid token');
//     }   
// }

export  function verifyToken(token, secret) {
    try {
        const decoded =  jwt.verify(token, secret, { algorithms: ['HS256'] });
        const tenantId = decoded.tenantId || decoded.sub;
        if (!tenantId) {
            throw new ApiError('Invalid token: tenantId missing');
        }
        const role = decoded.role || [];
        if(!role.includes('worknook:write') && !role.includes('admin')) {
            throw new ApiError('Forbidden: insufficient permissions');
        }
        return { tenantId, role, sub: decoded.sub, exp:decoded.exp };

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new ApiError('Token expired');
        }   
        if (err instanceof ApiError) {
            throw err;
        }
        throw new ApiError('Invalid token');
    }   
}