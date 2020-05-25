const User = require('../model/user');


exports.getUser = (req,res,next) => {

    const userId = req.params.userId;
    let userIsSame = false;
    let alreadyFollows = false;
    if(req.session.user._id.toString()===userId.toString()){
        userIsSame = true;
    }
    
    User.findById(userId).then(user => {

        if(!user){
            const error = new Error('user not found in the database');
            error.statusCode = 404;
            throw error;
        }

        if(user.followers.includes(req.session.user._id)){
            alreadyFollows = true;
        }
        


        res.render('userProfile',{
            userId:userId,
            user:user,
            userIsSame:userIsSame,
            alreadyFollows:alreadyFollows
    
        });
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
   

};
exports.getUserAnswers = (req,res,next) => {
    const userId = req.params.userId;
    let userIsSame = false;
    let alreadyFollows = false;
    if(req.session.user._id.toString()===userId.toString()){
        userIsSame = true;
    }
    User.findById(userId).populate({path:'answers',populate:{path:'question'}}).then(user => {
        if(!user){
            const error = new Error('user not found');
            error.statusCode = 404;
            throw error;
        }
        if(user.followers.includes(req.session.user._id)){
            alreadyFollows = true;
        }
        res.render('userData',{
            answers:user.answers,
            userId:userId,
            user:user,
            userIsSame:userIsSame,
            alreadyFollows:alreadyFollows,
           

            following:[],
            followers:[],
            questions:[],
            loggedIn:req.session.loggedIn,
            
            questionTab:false,
            answerTab:true,
            followerTab:false,
            followingTab:false
            
        })
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
    
};
exports.getUserQuestions = (req,res,next) => {
    const userId = req.params.userId;
    let userIsSame = false;
    let alreadyFollows = false;
    if(req.session.user._id.toString()===userId.toString()){
        userIsSame = true;
    }
    User.findById(userId).populate({path:'questions'}).then(user => {
        if(!user){
            const error = new Error('user not found');
            error.statusCode = 404;
            throw error;
        }
        if(user.followers.includes(req.session.user._id)){
            alreadyFollows = true;
        }
        res.render('userData',{
            questions:user.questions,
            userId:userId,
            user:user,
            userIsSame:userIsSame,
            alreadyFollows:alreadyFollows,
            
           
           
            following:[],
            followers:[],
            answers:[],
            loggedIn:req.session.loggedIn,
            
            questionTab:true,
            answerTab:false,
            followerTab:false,
            followingTab:false
        })
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
    
};
exports.getUserFollowing = (req,res,next) => {
    const userId = req.params.userId;
    let userIsSame = false;
    let alreadyFollows = false;
    if(req.session.user._id.toString()===userId.toString()){
        userIsSame = true;
    }
    User.findById(userId).populate('following').then(user => {
        if(!user){
            const error = new Error('user not found');
            error.statusCode = 404;
            throw error;
        }
        if(user.followers.includes(req.session.user._id)){
            alreadyFollows = true;
        }
        res.render('userData',{
            following:user.following,
            userId:userId,
            user:user,
            questions:[],
            followers:[],
            answers:[],
            loggedIn:req.session.loggedIn,
            alreadyFollows:alreadyFollows,
            
            userIsSame:userIsSame,
            questionTab:false,
            answerTab:false,
            followerTab:false,
            followingTab:true
        })
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
    
};
exports.getUserFollowers = (req,res,next) => {
    const userId = req.params.userId;
    let userIsSame = false;
    let alreadyFollows = false;
    if(req.session.user._id.toString()===userId.toString()){
        userIsSame = true;
    }
    User.findById(userId).populate('followers').then(user => {
        if(!user){
            const error = new Error('user not found');
            error.statusCode = 404;
            throw error;
        }
        if(user.followers.includes(req.session.user._id)){
            alreadyFollows = true;
        }
        res.render('userData',{
            followers:user.followers,
            userId:userId,
            user:user,
            userIsSame:userIsSame,
            alreadyFollows:alreadyFollows,

            following:[],
            questions:[],
            answers:[],
            loggedIn:req.session.loggedIn,
            
            questionTab:false,
            answerTab:false,
            followerTab:true,
            followingTab:false
        })
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
    
}


exports.postFollowUser = (req,res,next)=> {
    const userId = req.params.userId;//user to be followed
   

    User.findById(userId).then(user => {
        user.followers.push(req.session.user._id);
        console.log(user.followers);
        return user.save();
    }).then(result => {
        return User.findById(req.session.user._id)
    }).then(followerUser => {
        followerUser.following.push(userId);
        return followerUser.save();
    }).then(result => {
        res.redirect('/user/'+userId)
    }).catch(err=> {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}




exports.postUnfollowUser = (req,res,next)=> {
    const userId = req.params.userId;//user to be followed
    const reqUser = req.session.user;
    User.updateOne({_id:userId},{$pull:{followers:reqUser._id}}).then(result => {

            return User.updateOne({_id:reqUser._id},{$pull:{following:userId}});

       
    }).then(reResult=> {
        res.redirect('/user/'+userId);
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })

    // User.findById(userId).then(user => {
    //     user.followers.pull(req.session.user._id);
    //     console.log(user.followers);
    //     return user.save();
    // }).then(result => {
    //     return User.findById(req.session.user._id)
    // }).then(followerUser => {
    //     followerUser.following.push(userId);
    //     return followerUser.save();
    // }).then(result => {
    //     res.redirect('/user/'+userId)
    // }).catch(err=> {
    //     if(!err.statusCode){
    //         err.statusCode = 500;
    //     }
    //     next(err);
    // });
}