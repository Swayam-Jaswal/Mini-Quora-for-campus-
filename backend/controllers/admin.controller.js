const crypto = require('crypto');
const AdminCode = require('../models/adminCode');

const generateAdminCode = async(req,res) =>{
    try {
        const code = crypto.randomBytes(6).toString('hex');
        const expiresAt = new Date(Date.now() + 15*60*1000);

        const newCode = new AdminCode({
            code,
            expiresAt
        });

        await newCode.save();

        return res.status(200).json({message:"Admin code generated sucessfully",code,expiresInMinutes:15});
    } catch (error) {
        return res.status(500).json({message:"Failed to generate Admin Code",error});
    }
}

module.exports = {generateAdminCode};