const mongoose = require('mongoose');

const adminCodeSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
});

module.exports = mongoose.model("AdminCode",adminCodeSchema);