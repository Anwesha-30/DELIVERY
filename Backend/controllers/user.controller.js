const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const userService = require('../services/user.service');

module.exports.registerUser = async (req, res, next) => {

    // 1. Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // 2. Get data from request body
    const { fullname, email, password } = req.body;

    try {
        // 3. Hash password
        const hashedPassword = await userModel.hashPassword(password);

        // 4. Create user via service
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,          
            email,
            password: hashedPassword
        });

        // 5. Generate token
        const token = user.generateAuthToken();

        // 6. Send response
        res.status(201).json({
            token,
            user
        });

    } catch (err) {
        next(err);
    }
};

module.exports.loginUser = async (req, res, next) => {
    // 1. Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // TODO: Implement actual login logic (e.g. check user, compare password, return token)
    res.status(200).json({ message: "Login successful!" });
};