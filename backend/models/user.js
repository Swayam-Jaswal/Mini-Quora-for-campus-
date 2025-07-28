const mongoose = require('mongoose');
const {emailRegex} = require('../utils/validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[emailRegex,"Please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"Password Must be atleast 6 characters"],
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

const User = mongoose.model('User',userSchema);
module.exports = User