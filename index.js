const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')

const MONGO_URI = 'mongodb://localhost:27017/qna?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

const store = new MongoDBStore({
    uri:MONGO_URI,
    collection:'mySessions'
});
// const csrfProtection = csrf();

const app = express();



// const fileFilter = function(req,file,cb){
//     if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
//         cb(null,true);
//     }else{
//         cb(null,false);
//     }
// };
app.set('view engine','ejs');
app.set('views','views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({
    dest:'images'
}).single('image'));
app.use('/public',express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));


app.use(session({
    secret:'keyboard fox',
    resave:false,
    saveUninitialized:false,
    store:store
}));
// app.use(csrfProtection);
app.use(flash());

app.use((req,res,next) => {
    
    
    res.locals.loggedIn = req.session.loggedIn;
    next();
    // res.locals.csrfToken = req.csrfToken()
})




app.use(feedRoutes);
app.use('/auth',authRoutes);
app.use(userRoutes);

app.use((req,res,next)=> {
    res.render('404');
})
app.use((err,req,res,next)=> {
    res.render('error-handler',{
        error:err
    })
})


const port = process.env.PORT || 1234;
mongoose.connect(MONGO_URI).then(result => {
    console.log('database connected');
    app.listen(port);
    console.log(`listening on ${port}`);
    console.log('random git test')

}).catch(err => {
    console.log(err);
});
