const mongoose = require('mongoose');
require('dotenv').config();

const mongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("error connecting MongoDB",error);
        process.exit(1);
    }
}

module.exports = mongoDB;