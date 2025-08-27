const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    text:{
        type:String,
        required:[true,'announcement body is required'],
        trim:true,
    },
    type:{
        type:String,
        enum:["alert","deadline","info"],
        default:"info",
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},{timestamps:true});

const Announcement = mongoose.model("Announcement",announcementSchema);
module.exports = Announcement;