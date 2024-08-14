// middlewares/authenticateToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (token == null) return res.status(401).json({ success: false, msg: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ success: false, msg: 'Invalid token' });

        try {
            const user = await User.findById(decoded.userId).select('-password'); // Fetch user data without the password
            if (!user) {
                return res.status(404).json({ success: false, msg: 'User not found' });
            }
            req.user = user; // Attach the user data to the request object
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            res.status(500).json({ success: false, msg: error.message });
        }
    });
};

module.exports = authenticateToken;

