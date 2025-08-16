const Question = require('../models/question');

const createQuestion = async(req,res)=>{
    try {
        const {title,body,tags,isAnonymous} = req.body;
        
        if(!title && !body) return res.status(400).json({message:"title and body are required"});

        const question = new Question({
            title,
            body,
            tags,
            isAnonymous,
            author:req.user.id,
        })

        await question.save();

        return res.status(200).json({message:"question created successfully",question});
    } catch (error) {
        return res.status(500).json({message:"couldnt create question",error});
    }
}

const getAllQuestions = async(req,res)=>{
    try {
        const questions = await Question.find()
            .populate("author","name email role")
            .sort({createdAt:-1});
        
            return res.status(200).json({message:"fetched all questions", questions});
    } catch (error) {
        return res.status(500).json({message:"couldnt get all questions",error});
    }
}

const getQuestionById = async(req,res)=>{
    try {
        const {id} = req.params;

        const question = await Question.findById(id).populate("author","name,email,role");

        if(!question) return res.status(404).json({message:"Question not found"});

        return res.status(200).json({question});
    } catch (error) {
        return res.status(500).json({message:"error fetching question",error});
    }
}

module.exports = {createQuestion,getAllQuestions,getQuestionById};