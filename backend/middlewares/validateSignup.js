const { body } = require('express-validator');
const { emailRegex, passwordRegex } = require('../utils/validator');

const validateSignup = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .matches(emailRegex)
    .withMessage('Invalid email format'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .matches(passwordRegex)
    .withMessage(
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  body('adminCode')
    .optional()
    .isString(),
  body('moderatorCode')
    .optional()
    .isString()
];

module.exports = validateSignup;