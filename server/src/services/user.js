import model from '../db/models';
import bcrypt from 'bcrypt';
import crypto from 'randombytes';
import { raw } from 'body-parser';

const { User, VerificationCode, Role } = model;

/**
 * User service
 */
class UserService {
  /**
   *
   * @param {Object} user
   * @returns {Object} created user
   */
  static async createUser(userInfo) {
    const { firstName,
      lastName,
      gender,
      age,
      dob,
      maritalStatus,
      nationality,
      email, password, profileImage, supportDoc, identificationNumber } = userInfo;

    const pass = password ? password : Math.random().toString(36).slice(-15);
    const hashedPassword = await bcrypt.hash(pass, 10);
  
    const newUser = {
      firstName,
      lastName,
      gender,
      age,
      dob,
      maritalStatus,
      nationality,
      email,
      password: hashedPassword,
      status: "UNVERIFIED",
      profileImage
    };

    const user = await User.create(newUser);
    const { password: _password, status, resetPasswordToken, resetPasswordExpires, ...userDetails } = user.dataValues;
    return userDetails;
  }

  /**
 *
 * @param {String} user
 * @returns {Object} user
 */
  static async getUserByEmail(email) {
    const user = await User.findOne({ raw: true, where: { email } });
    return user;
  }
  
 /**
 *
 * @param {String} user
 * @returns {Object} user
 */
  // static async getUserById(identificationNumber) {
  //   const user = await User.findOne({ raw: true, where: { identificationNumber } });
  //   return user;
  // }
   /**
   * verify user
   * @param {*} req
   * @returns
   */
    static async verifyUser(email, status) {
       const user = await User.findOne({ where: { email } });
      const verifiedUser = await User.update(
        { status: status },
        { where: { email },
        returning: true,
        plain: true
       },
      );
      return verifiedUser;
    }
}

export default UserService;
