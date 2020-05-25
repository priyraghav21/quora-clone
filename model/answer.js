const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchmema = new Schema({
    answerContent: {
        type: String,
        required: true
    },
    question:{
        type: Schema.Types.ObjectId,
        ref:'Question',
        required:true
    },
    answerer: {
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    upvoters:[
        {
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    ],
    upvotes:{
        type:Number,
        default: 0
    }
},{timestamps: true});


module.exports = mongoose.model('Answer',answerSchmema);