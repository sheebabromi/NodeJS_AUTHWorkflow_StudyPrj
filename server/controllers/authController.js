const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
} = require('../utils');
const crypto = require('crypto');
//const sendEmail = require('../utils/sendEmail');
const sendEmailSendGrid = require('../utils/sendEmailSendGrid');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';
  //instead
  const verificationToken = crypto.randomBytes(40).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });
  const origin = 'http://localhost:3000';
  //via sendgrid
  await sendEmailSendGrid(
    user.name,
    user.email,
    user.verificationToken,
    origin
  );
  //via nodemailer
  // await sendVerificationEmail({
  //   name: user.name,
  //   email: user.email,
  //   verificationToken: user.verificationToken,
  //   origin,
  // });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({
    msg: 'Success, User is created, Pls verify your email',
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  // const tokenUser = createTokenUser(user);
  // attachCookiesToResponse({ res, user: tokenUser });
  // if (user.verificationToken === 'fake token') {
  //   user.isVerified = 'true';
  // }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify your email');
  }
  const tokenUser = createTokenUser(user);

  //create refresh token
  let refreshToken = '';

  //check for exisiting token
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ msg: 'token verified', user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);
  //attachCookiesToResponse({ res, user: tokenUser });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ msg: 'token verified', user: tokenUser });
};
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  if (verificationToken !== user.verificationToken) {
    throw new CustomError.UnauthenticatedError('Email & token is not valid');
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = '';

  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'token verified', user: user });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
};
