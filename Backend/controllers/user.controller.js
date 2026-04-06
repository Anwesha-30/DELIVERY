const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const userService = require('../services/user.service');


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
    module.exports.getUserProfile = async(req,res,next)=>{

    }
