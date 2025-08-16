const Answer = require('../models/answer');

const createAnswer = async(req,res)=>{
    try {
        const {body} = req.body;
        const {id} = req.params;

        if(!body) return res.status(400).json({message:"Answer body is required"});

        const answer = new Answer({
            body,
            question: id,
            author:req.user.id,
        });
        await answer.save();

        return res.status(200).json({message:"answer created sucessfully",answer});
    } catch (error) {
        return res.status(500).json({message:"error creating answer",error});
    }
}

const getAnswersByQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const answers = await Answer.find({ question: id })
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json(answers);
  } catch (error) {
    return res.status(500).json({ message: "error fetching answer", error });
  }
};

module.exports = { createAnswer, getAnswersByQuestion };