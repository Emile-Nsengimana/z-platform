import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
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

