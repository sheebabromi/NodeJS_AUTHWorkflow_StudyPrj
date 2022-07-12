const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const url = `${origin}/user/verify-email/?token=${verificationToken}&email=${email}`;
  const message = `<p>Please verify the email:<a href='${url}'>Verify Email</a></p> `;

  return sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h1>Welcome ${name}</h1>
 ${message}
 `,
  });
};

module.exports = sendVerificationEmail;
