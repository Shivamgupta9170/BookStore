const {check} = require('express-validator');

const User = require('../models/user');

exports.registerValidator = [
    check('username','name is required').not().isEmpty(),
    check('username', 'Username must be at least 4 characters long').isLength({ min: 4 }).custom(async (username) => {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('Username already in use');
        }
    }),
    check('email', 'Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }).custom(async (email) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already in use');
        }
    }),
    check('password','password is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('address',"address is required").not().isEmpty()
];


exports.loginValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password','password is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];


exports.updateValidator = [
    check('address',"address is required").not().isEmpty(),
];


exports.bookValidator = [
    check('url')
        .isURL().withMessage('Invalid URL format')
        .notEmpty().withMessage('URL is required'),
    check('title')
        .notEmpty().withMessage('Title is required'),
    check('author')
        .notEmpty().withMessage('Author is required'),
    check('price')
        .isFloat({ gt: 0 }).withMessage('Price must be a positive number')
        .notEmpty().withMessage('Price is required'),
    check('description')
        .notEmpty().withMessage('Description is required'),
    check('language')
        .notEmpty().withMessage('Language is required')
];

exports.bookUpdateValidator = [
    check('url').optional().isURL().withMessage('Invalid URL format'),
    check('title').optional().notEmpty().withMessage('Title is required'),
    check('author').optional().notEmpty().withMessage('Author is required'),
    check('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    check('description').optional().notEmpty().withMessage('Description is required'),
    check('language').optional().notEmpty().withMessage('Language is required')
];

