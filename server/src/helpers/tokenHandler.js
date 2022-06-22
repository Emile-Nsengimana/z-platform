import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
/**
 * generate and verify token
 */
class TokenHandler {
  /**
   *
   * @param {object} payload
   * @returns {string} token
   */
  static async generateToken(userDetails) {
    try {
      const payload = {id: userDetails.id,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        gender: userDetails.gender,
        email: userDetails.email,
        status: userDetails.status,
        } ;
      const accessToken = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 * process.env.TOKEN_LONG_EXP_TIME_IN_MINUTE });
      return accessToken;
    } catch (error) {
      return error;
    }
  }

    /**
   *
   * @param {object} payload
   * @returns {string} token
   */
     static async generateShortToken(userDetails) {
      try {
        const payload = {id: userDetails.id,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          gender: userDetails.gender,
          email: userDetails.email,
          status: userDetails.status,
          } ;
        const accessToken = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 * process.env.TOKEN_SHORT_EXP_TIME_IN_MINUTE });
        return accessToken;
      } catch (error) {
        return error;
      }
    }

  /**
   *
   * @param {object} token
   * @returns {object} verified token
   */
  // static async verifyToken(accessToken) {
  //   const payload = await jwt.decode(process.env.ACCESS_TOKEN_SECRET, accessToken);
  //   if (payload.error) return false;
  //   return payload.value;
  // }
  static async verifyToken(token) {
    const verifyToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return verifyToken;
  }
}
export default TokenHandler;
