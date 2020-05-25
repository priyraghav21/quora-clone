const express = require('express');
const router  = express.Router();

const userController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');

router.get('/user/:userId',userController.getUser);
router.get('/user-answers/:userId',userController.getUserAnswers);
router.get('/user-questions/:userId',userController.getUserQuestions);
router.get('/user-following/:userId',userController.getUserFollowing);
router.get('/user-followers/:userId',userController.getUserFollowers);
router.get('/userFollow/:userId',isAuth,userController.postFollowUser);
router.get('/userUnfollow/:userId',isAuth,userController.postUnfollowUser);




module.exports = router;