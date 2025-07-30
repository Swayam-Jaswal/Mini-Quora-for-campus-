const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const authRoutes = require('../backend/routes/auth.routes');
const adminRoutes = require('../backend/routes/admin.routes');
const dotenv = require('dotenv').config();
const mongoDB = require('./config/db');
mongoDB();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
});