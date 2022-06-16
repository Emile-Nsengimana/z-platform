import TokenHandler from '../helpers/tokenHandler';
import UserService from '../services/user';
import bcrypt from 'bcrypt';
import path from 'path';
import imageDataURI from 'image-data-uri';
import { uploader } from '../middlewares/cloudinary';
import fs from 'fs';
import { sendEmail } from "../helpers/sendVerificationEmail";


class UserController {
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} created user
   */
  static async registerUser(req, res) {
    try {
      const { firstName,
        lastName,
        gender,
        age,
        dob,
        maritalStatus,
        nationality,
        email, identificationNumber } = req.body;
      const emailExist = await UserService.getUserByEmail(email);
      const idExist = await UserService.getUserById(identificationNumber);
      const UPLOADS = process.env.ADDITIONAL_FILE_PATH;
      console.log("UPLOADS: ", UPLOADS);

      if (emailExist || idExist)
        return res.status(409).json({
          message: `email has been used before`,
        });
  // handle files
  let profileImage, supportDoc;
 
   if (req.files.profilePicture !== undefined) {
      let dataBuffer = new Buffer.from(req.files.profilePicture[0].buffer);
      let mediaType = path.extname(req.files.profilePicture[0].originalname).toString();
      let imageData = imageDataURI.encode(dataBuffer, mediaType);
      let uploadedImage = await uploader.upload(imageData);
      profileImage = uploadedImage.url;
  }
  if (req.files.additionalDoc !== undefined) {
    for (const file of req.files.additionalDoc) {
      const fileName = `${Date.now()}-${req.body.identificationNumber}-${file.originalname}`;
      const dataBuffer = new Buffer.from(file.buffer);

      UPLOADS === undefined ? await fs.writeFileSync(`${ __dirname}/../uploads/${fileName}`, dataBuffer, null) 
      : await fs.writeFileSync(`${UPLOADS}/${fileName}`, dataBuffer, null);
      supportDoc = fileName;
    }
  }

  req.body.profileImage = profileImage;
  req.body.supportDoc = supportDoc;
      const user = await UserService.createUser(req.body);
       const token = await TokenHandler.generateToken({
        id: user.identificationNumber,
        firstName,
        lastName,
        gender,
        age,
        dob,
        maritalStatus,
        nationality,
        email,
        status: user.status,
        expiresIn: Math.floor(Date.now() / 1000) + 86400,
      });
      return res.status(201).json({
        message: 'thank you for joining us, please check your email for verification',
        data: { ...user, token },
      });
    } catch (error) {
      console.log("Error:", error);
      if (error.errors) return res.status(400).json({ message: error.errors[0].message });
      return res.status(500).json({ message: 'Server error' });
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

      const payload = {
        id: user.identificationNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        age: user.age,
        dob: user.dob,
        maritalStatus: user.maritalStatus,
        nationality: user.nationality,
        email: user.email,
        status: user.status,
        expiresIn: Math.floor(Date.now() / 1000) + 86400,
      };
      const token = await TokenHandler.generateToken(payload);
      const { password, ...userInfo } = user;

      return res.status(200).json({
        message: 'successfully logged in',
        data: { ...userInfo, token },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'internal server error',
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

}

export default UserController;