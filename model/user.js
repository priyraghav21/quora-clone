const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchmema = new Schema({
    
    name:{
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required: true
    },
    upvoted:[
        {
            type:Schema.Types.ObjectId,
            ref:'Answer'
        }
    ],
    answers:[
        {
            type:Schema.Types.ObjectId,
            ref:'Answer'
        }
    ],
    questions:[
        {
            type:Schema.Types.ObjectId,
            ref:'Question'
        }
    ],
    followers:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    following:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ]
    
},{timestamps: true});


module.exports = mongoose.model('User',userSchmema);