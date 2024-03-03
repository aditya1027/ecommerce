import User from "../model/User.js";
import { getTokenFromHeader, verifyToken } from "../utils/authTokenHelper.js";

export const isLoggedIn = (req, res, next) => {
    const token = getTokenFromHeader(req);
    const decodedUser = verifyToken(token);

    if (!decodedUser) {
        throw new Error('Invalid/Expired token, please login again');
    }
    else {
        req.userAuthId = decodedUser?.id;
        next();
    }
}

export const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userAuthId);
    //Check if admin
    if (user && user.isAdmin) {
        next();
    } else {
        next(new Error('Access denied, admin only'))
    }
}