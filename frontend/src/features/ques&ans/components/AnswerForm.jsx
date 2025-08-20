import React, { useState } from "react";
import { toast } from "react-toastify";

export default function AnswerForm({onSubmit}) {

  const [formData,setFormData] = useState({
    body:"",
  });

  const [loading,setLoading] = useState(false);

  const handleOnChange=(e)=>{
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]:value,
    })
  };
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData.body.trim()){
      toast.error("Body cannot be empty");
    }
    setLoading(true);
    try {
      await onSubmit({
        body:formData.body.trim(),
      })
      setFormData({
        body:"",
      })
      toast.success("Answer posted successfully");
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    }finally{
      setLoading(false)
    };
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/20 p-4 rounded-xl shadow mt-4"
    >
      <h2 className="text-lg font-semibold mb-3">Your Answer</h2>

      <textarea
        name="body"
        placeholder="Write your answer..."
        rows={3}
        value={formData.body}
        onChange={handleOnChange}
        className="w-full p-2 mb-3 rounded-lg bg-black/30 text-white placeholder-gray-400 outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${
          loading ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"
        } text-white rounded-lg py-2 font-medium transition`}
      >
        {loading ? "Posting..." : "Post Answer"}
      </button>
    </form>
  );
}
