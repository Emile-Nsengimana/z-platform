import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import model from "../db/models";
import userService from "../services/user";

const { userOTP } = model;

dotenv.config();

export const sendEmail = async (email, verificationStatus) => {
  try {
    const successMessage = `
    <p>Hello</p>
    <p>You registered account on Company Z has been successfully verified,</p><br/>
    <br />
    <p>Kind Regards, Company z</p>`;

    const failMessage = `
    <p>Hello</p>
    <p>You registered account on Company Z has been denied, please contact help@companyz.rw for more details.</p>
    <br />
    <p>Kind Regards, Company z</p>`;

    var transporter = nodemailer.createTransport({ sendmail: true })


    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Company Z" <emilereas7@gmail.com>',
      to: email,
      subject: "Account verification",
      html: verificationStatus ? successMessage : failMessage,
    });

  } catch (error) {
    return `error ${error}`;
  }
};

export const sendPostRegistrationEmail = async (email, link) => {
  try {
    const message = `
    <p>Hello</p>
    <h2>You've successfully registered to Z platform</h2><br/>
    <br />

    <p>The next step is to upload your identification ID for account verification</p>
    <p>Please click <u><a href=${link}>here</a></u> to login into your account and upload the ID.</p>
    <p>⚠️<b>The ID maybe an National or Passport ID</b></p><br/>
    <p>Kind Regards, Company z</p>`;


    var transporter = nodemailer.createTransport({ sendmail: true })

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Zplatform" <emilereas7@gmail.com>',
      to: email,
      subject: "Account registration",
      html: message,
    });

  } catch (error) {
    console.log(error);
    return `error ${error}`;
  }
};


export const sendResetPasswordLinkEmail = async (email, link) => {
  try {
    const message = `
    <p>Hello</p>
    <h2>You've asked to reset your password</h2><br/>
    <br />
    Dear Emile

    <p>We have received your request to reset your password.</p>
    <p>Click <u><a href=${link}>here</a></u> to reset your password</p>
    <p>If you did not request a password reset, ignore this email.</p><br/>
    <p>Kind Regards, Company z</p>`;


    var transporter = nodemailer.createTransport({ sendmail: true })

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Zplatform" <emilereas7@gmail.com>',
      to: email,
      subject: "Account password reset",
      html: message,
    });

  } catch (error) {
    return `error ${error}`;
  }
};

export const send2FACodeEmail = async (email) => {
  try {

    const otp = Math.floor(1000 + Math.random() * 9000);

    const hashedOtp = await bcrypt.hash(otp + "", 10);
    const user = await userService.getUserByEmail(email);
    const userHasOtp = await userOTP.findOne({ where: { userId: user.id } });

    if (userHasOtp) {
      await userOTP.update({ otp: hashedOtp }, { where: { userId: user.id } });
    } else {
      await userOTP.create({ userId: user.id, otp: hashedOtp });
    }

    if (hashedOtp) {
      const message = `
      <p>Hello</p>
      <h2>The following is your verification code</h2><br/>
      <code>${otp}</code>
      <br />
  
      <p>Kind Regards, Company z</p>`;
      var transporter = nodemailer.createTransport({ sendmail: true })

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Zplatform" <emilereas7@gmail.com>',
        to: email,
        subject: "Authentication code",
        html: message,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error in send2FACodeEmail:", error)
    return false;
  }
};
