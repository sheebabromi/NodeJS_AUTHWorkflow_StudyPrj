const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  let info = await transporter.sendMail({
    from: ' "coder"<learnthecode21@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
