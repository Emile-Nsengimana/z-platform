import TokenHandler from '../helpers/tokenHandler';
import UserService from '../services/user';
import bcrypt from 'bcrypt';
import path from 'path';
import model from "../db/models";
import imageDataURI from 'image-data-uri';
import { uploader } from '../middlewares/cloudinary';
import fs from 'fs';
import { sendEmail, sendResetPasswordLinkEmail } from "../helpers/sendVerificationEmail";
import { Op } from 'sequelize';

const crypto = require('crypto');
const { User } = model;

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
          message: `email has been used before`,
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
      return res.status(201).json({
        message: 'thank you for joining us, please check your email for verification',
        data: { ...user, token },
      });
    } catch (error) {
      if (error.errors) return res.status(400).json({ message: error.errors[0].message });
      return res.status(500).json({ message: 'server error' });
    }
  }

  static async addUserVerificationInfo(req, res) {
    try {
      const { email } = req.user;
      const { identificationNumber } = req.body;

      const emailExist = await UserService.getUserByEmail(email);
      const UPLOADS = process.env.ADDITIONAL_FILE_PATH;

      if (!emailExist)
        return res.status(404).json({
          message: `user not found`,
        });

      // handle files
      let supportDoc;

      if (req.files.additionalDoc !== undefined) {
        for (const file of req.files.additionalDoc) {
          const fileName = `${Date.now()}-${req.body.identificationNumber}-${file.originalname}`;
          const dataBuffer = new Buffer.from(file.buffer);

          UPLOADS === undefined ? await fs.writeFileSync(`${__dirname}/../uploads/${fileName}`, dataBuffer, null)
            : await fs.writeFileSync(`${UPLOADS}/${fileName}`, dataBuffer, null);
          supportDoc = fileName;
        }
      }

      req.body.supportDoc = supportDoc;
      const user = await User.update({ identificationNumber, supportDoc, status: 'PENDING VERIFICATION' }, { where: { email } });

      return res.status(200).json({
        message: 'user info update successfully'
      });
    } catch (error) {
      console.log(">>>>>>>>", error);
      if (error.errors) return res.status(400).json({ message: error.errors[0].message });
      return res.status(500).json({ message: 'server error' });
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
      if (user === null) return res.status(404).json({ message: `user not found` });

      if (!bcrypt.compareSync(req.body.password, user.password))
        return res.status(401).json({ message: 'invalid credentials' });

      const token = await TokenHandler.generateToken(user);
      const { password, ...userInfo } = user;

      return res.status(200).json({
        message: 'successfully logged in',
        data: { ...userInfo, token },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'server error',
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
          message: `user not found`,
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
      return res.status(500).json({ message: 'server error' });
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
      return res.status(400).json({ message: 'invalid or expired token' });
    } else {
      if (bcrypt.compareSync(req.body.newPassword, user.password))
        return res.status(409).json({ message: 'you can\'t use the same password as before' });

      const passwd = await bcrypt.hash(req.body.newPassword, 10);
      const updatedUser = await User.update(
        { resetPasswordToken: undefined, resetPasswordExpires: undefined, password: passwd },
        { where: { resetPasswordToken: req.query.token } }
      );
      if (updatedUser) {
        return res.status(200).json({ message: 'password changed succesfully' });
      }
    }
    return res.status(500).json({ message: 'server error' });
  }

  static async forgotPassword(req, res) {
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpires = Date.now() + 300000; //expires in 5 min
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    const updatedUser = await User.update(
      { resetPasswordToken, resetPasswordExpires },
      { where: { email: req.params.email } }
    );

    if (updatedUser) {
      const link = "http://" + req.headers.host + "/reset?token=" + resetPasswordToken;
      sendResetPasswordLinkEmail(req.params.email, link);
      return res.status(200).json({ message: 'reset password link has been sent to your email' });
    }

    return res.status(500).json({ message: 'server error' });
  }
}

export default UserController;