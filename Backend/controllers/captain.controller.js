const { validationResult } = require('express-validator');
const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.services');
const blacklistTokenModel = require('../models/blacklistToken.model');

// ================= REGISTER CAPTAIN =================
module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    try {
        const isCaptainAlreadyExist = await captainModel.findOne({ email });

        if (isCaptainAlreadyExist) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        const hashedPassword = await captainModel.hashPassword(password);

        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        });

        const token = captain.generateAuthToken();

        // 🍪 Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            token,
            captain
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
};

// ================= LOGIN CAPTAIN =================
module.exports.loginCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = captain.generateAuthToken();

        // 🍪 Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            token,
            captain
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
};

// ================= PROFILE =================
module.exports.getCaptainProfile = async (req, res, next) => {
    // Return req.captain (assuming auth middleware sets it) or req.user if authUser is used.
    res.status(200).json(req.captain || req.user); // fallback to req.user if reusing user auth
};

// ================= LOGOUT =================
module.exports.logoutCaptain = async (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            (req.headers.authorization &&
                req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(400).json({
                message: 'No token provided'
            });
        }

        // 🔹 Blacklist token
        await blacklistTokenModel.create({ token });

        // 🔹 Clear cookie
        res.clearCookie('token');

        res.status(200).json({
            message: 'Logged out successfully'
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
};