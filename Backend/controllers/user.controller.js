const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const blacklistTokenModel = require('../models/blacklistToken.model');
// ================= REGISTER =================
module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    try {
        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            token,
            user
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
};


// ================= LOGIN =================
module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // 🔹 Find user
        const user = await userModel.findOne({ email }).select('+password');

        // ❗ If user not found
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 🔹 Compare password
        const isMatch = await user.comparePassword(password);

        // ❗ If password incorrect
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 🔹 Generate token
        const token = user.generateAuthToken();

        res.status(200).json({
            token,
            user
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
}
//cookies set up
    const token = user.generateAuthToken();
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 360000
    })
    module.exports.getUserProfile = async(req,res,next)=>{
        res.status(200).json(req.user);
    }

    module.exports.logoutUser = async(req,res,next)=>{
        res.clearCookies('token');
        const token = req.cookies.token ||
            (req.headers.authorization &&
                req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(400).json({
                message: 'No token provided'
            });
        }

        // 🔹 Add token to blacklist
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

    