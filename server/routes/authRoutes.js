const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  verifyEmail,
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authentication');

router.route('/register').post(register);
router.route('/login').post(login);
router.get('/logout', logout);
router.post('/verify-email', verifyEmail);

module.exports = router;
