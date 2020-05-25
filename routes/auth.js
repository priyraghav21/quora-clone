const express = require('express');
const {body} = require('express-validator');

const router = express.Router();
const isAuth = require('../middleware/isAuth');

const authController = require('../controllers/auth');

router.get('/login',authController.getLogin);

router.post('/login',[
    body('email').isEmail().withMessage('this is an invalid email').normalizeEmail(),
    body('password').notEmpty().isLength({min:8}).withMessage('password should be atleast 8 characters long')
],authController.postLogin);

router.get('/logout',isAuth,authController.getLogout);

router.get('/signup',authController.getSignup);

router.post('/signup',[
    body('name').notEmpty().isLength({min:3}),
    body('email').isEmail().withMessage('invalid email').normalizeEmail(),
    body('password').notEmpty().isLength({min:8}).withMessage('password should be at least 8 characters long'),
    body('confirmPassword').custom((value,{req}) => {
        if(value!=req.body.confirmPassword){
            throw new Error('passwords should match')
            
        }
        return true;
    })
],authController.postSignup);

module.exports = router;