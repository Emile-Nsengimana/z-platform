import jwt from "jsonwebtoken";
import model from "../db/models";
import tokenHandler from "../helpers/tokenHandler";

const { User } = model;

exports.allowIfHasToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token)
            return res.status(401).json({
                RangeError: 'no token provided',
            });
        if (token) {
            const tokenPayload = await tokenHandler.verifyToken(token);
             const { id, exp } = tokenPayload;

            // Check if token has expired
            if (exp < Math.floor(Date.now() / 1000)) {
                return res.status(401).json({
                    error: 'session has expired, please login again',
                });
            }
            req.user = await User.findOne({ raw: true, where: { id } });
            next();
        }
    } catch (error) {
        if (error.errors) {
            return res.status(401).json({
                error: error.errors[0].message,
            });
        }

        return res.status(401).json({
            error: 'session has expired, please login again',
        });
    }
};