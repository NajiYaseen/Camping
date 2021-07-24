const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/users')

router.route('/register')
    .get(userController.rendRegisterForm)
    .post(catchAsync(userController.addRegistration));

router.route('/login')
    .get(userController.renderLoginPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login)

router.get('/logout', userController.logout)

module.exports = router;