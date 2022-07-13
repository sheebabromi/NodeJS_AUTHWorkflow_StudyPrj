const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const SendResetPasswordEmail = async (name, email, passwordToken, origin) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const reset_url = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
  const message = `<h1>Please reset your Password:<a href='${reset_url}'>Reset Password</a> </h1>`;
  const msg = {
    to: email,
    from: 'learnthecode21@gmail.com',
    subject: 'NodeJS Password Reset email',
    html: `Welcome ${name},
    ${message}
    `,
  };
  await sgMail.send(msg);
};
module.exports = SendResetPasswordEmail;
