// controllers/authController.js
const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: 'Validation errors',
            errors: errors.array()
        });
    }

    const { username, email, password, address } = req.body;

    const isExistUser = await User.findOne({ email });

    if (isExistUser) {
        return res.status(400).json({
            success: false,
            msg: 'Email already exists',
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({
            username,
            email,
            password: hashPassword,
            address
        });

        const userData = await user.save();

        res.status(201).json({
            success: true,
            msg: 'User registered successfully',
            data: userData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};

const generateAccessToken = (user) => {
    const payload = { userId: user._id.toString() }; // Ensure user ID is a string
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });
    return token;
};

const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation errors',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: 'Email or password is incorrect',
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, userData.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                msg: 'Email or password is incorrect',
            });
        }

        const accessToken = generateAccessToken(userData);

        res.status(200).json({
            success: true,
            msg: 'User logged in successfully',
            accessToken: accessToken,
            tokenType: 'Bearer',
            data: userData
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};

const updateAddress = async (req, res) => {
    const userId = req.user._id;
    const { address } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { address }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        res.status(200).json({
            success: true,
            msg: 'Address updated successfully',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    updateAddress
};


