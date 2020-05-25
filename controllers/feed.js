const Question = require('../model/question');
const Answer = require('../model/answer');
const User = require('../model/user');



exports.getFeed = (req, res, next) => {

    let hasUpvoted = false;//check for upvote button to be active
    let userId;
    if(req.session.user) {
        userId = req.session.user._id;
    }else{
        userId = 'doesnotexist';
    }

    Answer.find({}).populate([{ path: 'question' }, { path: 'answerer' }]).sort({ createdAt: -1 }).then(answers => {

    
        answers.forEach(ans=> {
            if(ans.upvoters.includes(userId)){
                hasUpvoted = true;
               
               
                ans.hasUpvoted = hasUpvoted;
            }else {
                ans.hasUpvoted = hasUpvoted;
                
            }
        })

        console.log(answers);
        res.render('feed', {
            loggedIn: req.session.loggedIn,
            user: req.session.user,
            answers: answers
        });







    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
        }
    });


};
exports.getAskQues = (req, res, next) => {
    res.render('askQues', {
        message: null,
        loggedIn: req.session.loggedIn
    });
};

exports.postAskQues = (req, res, next) => {
    const questionTitle = req.body.question;
    const userId = req.session.user._id;
    const question = new Question({
        questionTitle: questionTitle,
        asker: userId
    });
    let savedQuestion;
    question.save().then(question => {
        savedQuestion = question;

        return User.findById(userId);
    }).then(user => {

        user.questions.push(savedQuestion._id)
        return user.save();
        
    }).then(result=> {
        res.render('askQues', {
            message: 'we will notify you when you get an answer',
            loggedIn: req.session.loggedIn
        })
    }).catch(err => {
        console.log(err);
    })

};
exports.getAnsQues = (req, res, next) => {

    Question.find({}).populate('asker').then(questions => {
        res.render('ansQues', {
            questions: questions,
            loggedIn: req.session.loggedIn
        })
    }).catch(err => {
        console.log(err);
    })

};

exports.getWriteAns = (req, res, next) => {
    const quesId = req.params.quesId;
    Question.findById(quesId).select('questionTitle').then(question => {
        res.render('writeAns', {
            question: question,
            loggedIn: req.session.loggedIn
        })
    }).catch(err => {
        console.log(err);
    });
};
exports.postAnsQues = (req, res, next) => {
    const quesId = req.body.quesId;
    const answer = req.body.answer;
    const userId = req.session.user._id;
    let savedAnswer;
    let savedQues;
    const newAnswer = new Answer({
        answerContent: answer,
        question: quesId,
        answerer: req.session.user._id
    });
    newAnswer.save().then(result => {
        savedAnswer = result;
        return Question.findById(quesId);
    })
        .then(question => {

            question.answersList.unshift(savedAnswer);
            return question.save();

        }).then(q => {
            savedQues = q
             User.findById(userId).then(user=> {
                 user.answers.push(savedAnswer);
                 return user.save();
             }).then(result => {
                res.render('quesDetails', {
                    question: savedQues,
                    answer: savedAnswer,
                    singleAns: true,
                    loggedIn: req.session.loggedIn
                });
             })
        }).catch(err => {
            console.log(err);
        });
};

exports.getQuesDetails = (req, res, next) => {
    const quesId = req.params.quesId;
    Question.findById(quesId).populate({ path: 'answersList', populate: { path: 'answerer' } }).then(quesDoc => {



        res.render('quesDetails', {
            questionDetails: quesDoc,
            singleAns: false,
            loggedIn: req.session.loggedIn
        })
    }).catch(err => {
        console.log(err);
    })
};
exports.getUpvote = (req, res, next) => {
    const ansId = req.params.ansId;
    let answer;

    Answer.findById(ansId).then(foundAnswer => {

        answer = foundAnswer;
        return User.findById(req.session.user._id);


    }).then(user => {



        let upvoteCount = answer.upvotes;




        if (!answer.upvoters.includes(req.session.user._id)) {
            answer.upvoters.unshift(req.session.user._id);
            upvoteCount++;
            answer.upvotes = upvoteCount;

            user.upvoted.push(ansId);
        } else {
            upvoteCount--;
            answer.upvotes = upvoteCount;
            const upvoterIndex = answer.upvoters.indexOf(req.session.user._id.toString());
            const userUpvotedIndex = user.upvoted.indexOf(ansId);
            user.upvoted.splice(userUpvotedIndex, 1);
            answer.upvoters.splice(upvoterIndex, 1);

        }

        return user.save();



    }).then(result => {
        return answer.save();
    }).then(a => {
        res.status(201).json({
            upvoteCount: a.upvotes
        });
    })
        .catch(err => {
            console.log(err);
        })

};
