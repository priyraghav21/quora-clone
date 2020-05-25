const express = require('express');
const router = express.Router();

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/isAuth');

router.get('/',feedController.getFeed);

router.get('/askQues', isAuth, feedController.getAskQues);
router.post('/askQues', isAuth, feedController.postAskQues);




router.get('/ansQues',isAuth,feedController.getAnsQues);
router.get('/write/:quesId',isAuth,feedController.getWriteAns);
router.post('/ansQues',isAuth,feedController.postAnsQues);
router.get('/quesDetails/:quesId',isAuth,feedController.getQuesDetails);
router.get('/upvote/:ansId',feedController.getUpvote);



module.exports = router;