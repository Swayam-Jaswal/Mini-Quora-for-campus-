import React, { useState } from "react";
import { toast } from 'react-toastify';

export default function QuestionForm({onSubmit}) {
  const [formData,setFormData] = useState({
    title:"",
    body:"",
    tags:"",
  });
  const [loading,setLoading] = useState(false);

  const handleOnChange=(e)=>{
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]:value
    })
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();

    if(!formData.title.trim()||!formData.body.trim()){
      toast.error("title and body is required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title:formData.title.trim(),
        body:formData.body.trim(),
        tags:formData.tags
          .split(",")
          .map((tags)=>tags.trim())
          .filter(Boolean)
      });

      setFormData({
        title:"",
        body:"",
        tags:"",
      })
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    }finally{
      setLoading(false)
    };
  }

  return (
     <form
      onSubmit={handleSubmit}
      className="bg-black/20 p-4 rounded-xl shadow mb-6"
    >
      <h2 className="text-lg font-semibold mb-3">Ask a Question</h2>

      <input
        type="text"
        name="title"
        placeholder="Enter question title"
        value={formData.title}
        onChange={handleOnChange}
        className="w-full p-2 mb-3 rounded-lg bg-black/30 text-white placeholder-gray-400 outline-none"
      />

      <textarea
        name="body"
        placeholder="Describe your question..."
        rows={3}
        value={formData.body}
        onChange={handleOnChange}
        className="w-full p-2 mb-3 rounded-lg bg-black/30 text-white placeholder-gray-400 outline-none"
      />

      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={handleOnChange}
        className="w-full p-2 mb-3 rounded-lg bg-black/30 text-white placeholder-gray-400 outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${
          loading ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
        } text-white rounded-lg py-2 font-medium transition`}
      >
        {loading ? "Posting..." : "Post Question"}
      </button>
    </form>
  );
}
