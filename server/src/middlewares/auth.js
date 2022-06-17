import jwt from "json-web-token";
import model from "../db/models";

const { User } = model;

exports.allowIfHasToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token)
            return res.status(401).json({
                message: 'no token provided',
            });
        if (token) {
            const tokenPayload = await jwt.decode(process.env.ACCESS_TOKEN_SECRET, token);
            const { id, expiresIn } = tokenPayload.value;

            // Check if token has expired
            if (expiresIn < Math.floor(Date.now() / 1000)) {
                return res.status(401).json({
                    message: 'token has expired, please login to obtain a new one',
                });
            }
            req.user = await User.findOne({ raw: true, where: { id } });
            next();
        } else {
            next();
        }
    } catch (error) {
        if (error.errors) {
            return res.status(401).json({
                message: error.errors[0].message,
            });
        }
        return res.status(500).json({
            message: 'server Error',
        });
    }
};