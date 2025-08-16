const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true,"title is required"],
        trim:true
    },
    body:{
        type:String,
        default:""
    },
    tags:{
        type:[String],
        default:[]
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isAnonymous:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Question = mongoose.model("Question",questionSchema);
module.exports = Question;