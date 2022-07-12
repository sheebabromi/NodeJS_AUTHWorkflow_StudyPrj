require('dotenv').config();

module.exports = {
  service: 'gmail',
  host: 'smtp.gmail.com.',
  port: 587,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },

  // host: 'smtp.ethereal.email',
  // port: 587,
  // auth: {
  //   user: 'barton.paucek20@ethereal.email',
  //   pass: 'q4qKVF6Yzg266KssyU',
  // },
};
