import TokenHandler from '../helpers/tokenHandler';
import UserService from '../services/user';
import bcrypt from 'bcrypt';
import path from 'path';
import model from "../db/models";
import imageDataURI from 'image-data-uri';
import { uploader } from '../middlewares/cloudinary';
import fs from 'fs';
import { sendEmail, sendResetPasswordLinkEmail, send2FACodeEmail, sendPostRegistrationEmail } from "../helpers/sendVerificationEmail";
import { Op } from 'sequelize';

const crypto = require('crypto');
const { User, userOTP } = model;

class UserController {
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} created user + token
   */
  static async registerUser(req, res) {
    try {
      const { email } = req.body;
      const emailExist = await UserService.getUserByEmail(email);

      //If user with the same email exist, hart registration
      if (emailExist) {
        return res.status(409).json({
          error: `email has been used before`,
        });
      }

      // extract the profile image from the request and upload it to cloudinary
      let profileImage;
      if (req.files.profilePicture !== undefined) {
        let dataBuffer = new Buffer.from(req.files.profilePicture[0].buffer);
        let mediaType = path.extname(req.files.profilePicture[0].originalname).toString();
        let imageData = imageDataURI.encode(dataBuffer, mediaType);
        let uploadedImage = await uploader.upload(imageData);
        profileImage = uploadedImage.url;
      }

      req.body.profileImage = profileImage; // append the profileImage url from cloudinary to the body
      const user = await UserService.createUser(req.body);
      const token = await TokenHandler.generateToken(user);

      const link = req.headers.origin + "/login";
      await sendPostRegistrationEmail(email, link);
      return res.status(201).json({
        message: 'thank you for joining us, please check your email for the next step',
        data: { ...user, token },
      });
    } catch (error) {
      if (error.errors) return res.status(400).json({ error: error.errors[0].message });
      return res.status(500).json({ error: 'server error' });
    }
  }

  /**
  *
  * @param {object} req
  * @param {object} res
  * @returns {string} acknowledgement message
  */
  static async uploadIDimage(req, res) {
    try {
      const { email } = req.user;
      const { identificationNumber } = req.body;

      const UPLOADS = process.env.ADDITIONAL_FILE_PATH; // path to store uploaded ID images

      //If user not found, stop
      const userDetails = await UserService.getUserByEmail(email);
      if (!userDetails)
        return res.status(404).json({ error: `user not found` });

      //If user is verified, no need to upload ID image
      if (userDetails.status === "VERIFIED")
        return res.status(404).json({ error: 'ID already exist and verified' });

      //Extraction of ID image from the request
      let supportDoc;
      if (req.files.additionalDoc !== undefined) {
        let dataBuffer = new Buffer.from(req.files.additionalDoc[0].buffer);
        let mediaType = path.extname(req.files.additionalDoc[0].originalname).toString();
        let imageData = imageDataURI.encode(dataBuffer, mediaType);
        let uploadedImage = await uploader.upload(imageData);
        supportDoc = uploadedImage.url;
      }

      const user = await User.update({ identificationNumber, supportDoc, status: 'PENDING VERIFICATION' }, { where: { email } });
      return res.status(200).json({
        message: 'ID uploaded successfully'
      });
    } catch (error) {
      if (error.errors) return res.status(400).json({ error: error.errors[0].message });
      return res.status(error).json({ error: 'server error' });
    }
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {Object} user
   */
  static async signIn(req, res) {
    try {
      const user = await UserService.getUserByEmail(req.body.email.trim());
      if (user === null) return res.status(404).json({ error: `user not found` });

      if (!bcrypt.compareSync(req.body.password, user.password))
        return res.status(401).json({ error: 'invalid credentials' });

      const token = await TokenHandler.generateShortToken(user);
      const multiFactorAuthCodeSent = await send2FACodeEmail(req.body.email.trim())

      if (!multiFactorAuthCodeSent) {
        console.log(multiFactorAuthCodeSent);
        return res.status(500).json({ error: 'server error' });
      }

      return res.status(200).json({
        message: 'please check your email for verification code',
        data: { token },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'server error',
      });
    }
  }


  /**
   * @param {object} req
   * @param {object} res
   * @returns {Object} user
   */
  static async multiFactorAuth(req, res) {
    try {
      const { user } = req;
      if (user === null) return res.status(404).json({ error: `user not found` });
      const otpDetails = await userOTP.findOne({ where: { userId: user.id } });

      if (!bcrypt.compareSync(req.body.otp, otpDetails.otp))
        return res.status(400).json({ error: 'invalid code' });

      const token = await TokenHandler.generateToken(user);
      const { password, ...userInfo } = user;


      return res.status(200).json({
        message: 'logged in successfully',
        data: { ...userInfo, token },
      });
    } catch (error) {
      return res.status(500).json({
        error: 'server error',
      });
    }
  }


  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success message
   */
  static async verifyUser(req, res) {
    try {
      const { email } = req.query;
      const { status } = req.body;

      const userDetails = await UserService.getUserByEmail(email);

      if (!userDetails)
        return res.status(404).json({
          error: `user not found`,
        });
      if (userDetails.status === "VERIFIED")
        return res.status(200).json({
          message: `user is already verified`,
        });
      const verifiedUser = await UserService.verifyUser(email, status);
      verifiedUser ? await sendEmail(email, true) : await sendEmail(email, false);
      return res.status(200).json({
        message: 'user verified successfully',
        data: {
          ...verifiedUser['1'].dataValues
        }
      });
    } catch (error) {
      return res.status(500).json({ error: 'server error' });
    }
  }

  static async resetPassword(req, res) {
    const user = await User.findOne({
      raw: true,
      where: {
        [Op.and]: [{ resetPasswordToken: req.query.token, resetPasswordExpires: { [Op.gt]: Date.now() } }]
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'invalid or expired token' });
    } else {
      if (bcrypt.compareSync(req.body.newPassword, user.password))
        return res.status(409).json({ error: 'you can\'t use the same password as before' });

      const passwd = await bcrypt.hash(req.body.newPassword, 10);
      const updatedUser = await User.update(
        { resetPasswordToken: undefined, resetPasswordExpires: undefined, password: passwd },
        { where: { resetPasswordToken: req.query.token } }
      );
      if (updatedUser) {
        return res.status(200).json({ message: 'password changed succesfully' });
      }
    }
    return res.status(500).json({ error: 'server error' });
  }

  static async forgotPassword(req, res) {
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpires = Date.now() + 300000; //expires in 5 min
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    const updatedUser = await User.update(
      { resetPasswordToken, resetPasswordExpires },
      { where: { email: req.params.email } }
    );

    if (updatedUser) {
      const link = req.headers.origin + "/reset?token=" + resetPasswordToken;
      await sendResetPasswordLinkEmail(req.params.email, link);
      return res.status(200).json({ message: 'reset password link has been sent to your email' });
    }

    return res.status(500).json({ error: 'server error' });
  }
}

export default UserController;