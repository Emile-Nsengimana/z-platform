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

 
