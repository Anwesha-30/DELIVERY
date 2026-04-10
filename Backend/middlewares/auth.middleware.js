const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

module.exports.authUser = async (req, res, next) => {
    try {
        // 🔹 Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Unauthorized: No token provided'
            });
        }

        // 🔹 Extract token from authheader
        const token = authHeader.split(' ')[1];

        // 🔹 Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔹 Find user
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized: User not found'
            });
        }

        // 🔹 Attach user to request
        req.user = user;

        next();

    } catch (err) {
        console.log('AUTH ERROR:', err);

        return res.status(401).json({
            message: 'Unauthorized: Invalid token'
        });
    }
};