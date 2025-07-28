const User = require('../models/User');
const AdminCode = require('../models/adminCode');
const {emailRegex,passwordRegex} = require('../utils/validator');
const {sendVerificationEmail} = require("../utils/sendEmail");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const signup = async (req,res) =>{
    try {
        const {name,email,password,adminCode} = req.body;
        const emailCheck =await User.findOne({email});

        if(!name || !email || !password){
            return res.status(400).json({message:"all fields are required"});
        }

        if(!emailRegex.test(email)){
            return res.status(400).json({message:"invalid email format"})
        }

        if(emailCheck){
            return res.status(409).json({message:"email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        let role = "user";
        if(adminCode){
            const foundCode = await AdminCode.findOne({code:adminCode});

            if(!foundCode || foundCode.expiresAt<new Date()){
                return res.status(400).json({message:"Invalid or expired admin token"});
            }

            role = "admin";
            await AdminCode.deleteOne({_id:foundCode._id})
        }

        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            role
        })

        await newUser.save();

        const mailToken = jwt.sign({userID:newUser._id},process.env.JWT_SECRET,{expiresIn:"10m"});

        const verificationLink = `http://localhost:5173/verify-email?token=${mailToken}`;

        await sendVerificationEmail(email,verificationLink);

        return res.status(201).json({message:"User created successfully"});
    } catch (error) {
        return res.status(500).json({message:"error registering user",error})
    }
}

const verifyEmail = async(req,res)=>{
    try {
      const { token } = req.query;

      if(!token){
        return res.status(404).json({message:"token not found"});
      }

      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      const userID = decoded.userID;

      const user = await User.findByIdAndUpdate(userID);

      if(!user){
        return res.status(404).json({message:"user not found"});
      }

      if(user.isVerified){
        return res.status(200).json({message:"User already exist"});
      }

      user.isVerified = true;
      user.save();

      return res.status(200).json({message:"Email verification completed successfully"});

    } catch (error) {
        console.error("Verification error",error);
        return res.status(400).json({message:"Invalid or expired token"});
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const existingUser = await User.findOne({email});

        if(!email || !password){
            return res.status(400).json({message:"email and password required"});
        }
        
        if(!existingUser){
            return res.status(404).json({message:"user not found"});
        }
        
        const passwordCheck = await bcrypt.compare(password,existingUser.password);

        if(!passwordCheck){
            return res.status(400).json({message:"invalid password"});
        }

        const tokenData = {
            id: existingUser._id,
            name:existingUser.name,
            email:existingUser.email,
            role:existingUser.role
        }

        const token = jwt.sign(tokenData,process.env.JWT_SECRET,{
            expiresIn:"7d"
        });
        res.cookie("access_token",token,{
            httponly:true,
            sameSite:"Strict",
            maxAge:7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
          message: "logged in successfully",
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
          },
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({message:"error logging in",error})
    }
}

const logout = async (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {signup,verifyEmail,login,logout};