const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const SendEmailSendGrid = async (name, email, verificationToken, origin) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const verify_url = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<h1>Please verify your email:<a href='${verify_url}'>Verify Email</a> </h1>`;
  const msg = {
    to: email,
    from: 'learnthecode21@gmail.com',
    subject: 'NodeJS Verification email',
    html: `Welcome ${name},
    ${message}
    `,
  };
  await sgMail.send(msg);
};
module.exports = SendEmailSendGrid;
