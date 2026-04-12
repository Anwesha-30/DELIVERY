const express = require('express');
const router = express.Router();

// 🔹 Validator
const { body } = require('express-validator');

// 🔹 Controller
const captainController = require('../controllers/captain.controller');

// 🔹 Auth Middleware
const authMiddleware = require('../middlewares/auth.middleware');


// ================= REGISTER CAPTAIN =================
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid Email'),

    body('fullname.firstname')
      .isLength({ min: 3 })
      .withMessage('Firstname must be at least 3 characters'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),

    body('vehicle.color')
      .isLength({ min: 3 })
      .withMessage('Color must be at least 3 characters'),

    body('vehicle.plate')
      .isLength({ min: 3 })
      .withMessage('Plate must be at least 3 characters'),

    body('vehicle.capacity')
      .isInt({ min: 1 })
      .withMessage('Capacity must be at least 1'),

    body('vehicle.vehicleType')
      .isIn(['car', 'motorcycle', 'auto'])
      .withMessage('Invalid vehicle type'),
  ],

  captainController.registerCaptain
);


// ================= LOGIN CAPTAIN =================
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid Email'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],

  captainController.loginCaptain
);


// ================= PROFILE =================
router.get(
  '/profile',
  authMiddleware.authUser,
  captainController.getCaptainProfile
);


// ================= LOGOUT =================
router.get(
  '/logout',
  authMiddleware.authUser,
  captainController.logoutCaptain
);


// ================= EXPORT =================
module.exports = router;