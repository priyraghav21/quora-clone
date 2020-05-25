const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

const User = require('../model/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        loggedIn : req.session.loggedIn || false,
        errorMessage:req.flash('error')
    });
};
exports.postLogin = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errorMessage = errors.array()[0].msg;
        req.flash('error',errorMessage);
        return res.status(422).redirect('login');
    }
    const email = req.body.email;
    const password = req.body.password;
    let founduser;
    User.findOne({ email: email }).then(user => {
        if (!user) {
            req.flash('error','User not found');
            return res.redirect('login');
        }
        founduser = user; 
        bcrypt.compare(password,user.password).then(doMatch => {
            if(!doMatch){
                req.flash('error','wrong password entered');
                return res.redirect('login');
            }
    
            
            req.session.loggedIn = true;
            req.session.user = founduser;
            res.redirect('/');
        })


    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
            next(err);
        }
    })


}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err){
            err.statusCode = 500;
            next(err);
        }
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        errorMessage:req.flash('error'),
        loggedIn: req.session.loggedIn
    })
}
exports.postSignup = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errorMessage = errors.array()[0].msg;
        req.flash('error',errorMessage);
        return res.status(422).redirect('signup');
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const imageUrl = req.file.path.replace("\\","/");
    console.log(imageUrl);
    User.findOne({ email: email }).then(user => {
        if (user) {
            req.flash('error','User already exists!');
            return res.redirect('signup');
        }
        bcrypt.hash(password, 12).then(hashedPw => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPw,
                imageUrl:imageUrl
            });

            return user.save();
        }).then(user => {
            res.redirect('login');
        }).catch(err=> {
            if(!err.statusCode){
                err.statusCode = 500;
                next(err);
            }
        })
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
            next(err);
        }
    });

}