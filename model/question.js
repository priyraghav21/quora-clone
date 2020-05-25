const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchmema = new Schema({
    questionTitle: {
        type: String,
        required: true
    },

    asker: {
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    answersList:[
        {
            type: Schema.Types.ObjectId,
            ref:'Answer'
            
        }
    ]
},{timestamps: true});


module.exports = mongoose.model('Question',questionSchmema);