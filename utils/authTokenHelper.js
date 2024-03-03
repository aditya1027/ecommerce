import jwt from "jsonwebtoken";

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, {
        expiresIn: '3d'
    })
}

export const getTokenFromHeader = (req) => {
    const token = req?.headers?.authorization?.split(' ')[1];

    if (token === undefined) {
        return 'No token defined'
    }
    else {
        return token;
    }
}

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return false;
        } else {
            return decoded;
        }
    })
}