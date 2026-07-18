const express = require('express');
const {
    signup,
    login,
    githubAuthRedirect,
    githubCallback,
    getProfile,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// local auth
router.post('/signup', signup);
router.post('/login', login);

// github oauth
router.get('/auth/github', githubAuthRedirect);
router.get('/auth/github/callback', githubCallback);

// protected profile
router.get('/profile', authMiddleware, getProfile);

module.exports = router;