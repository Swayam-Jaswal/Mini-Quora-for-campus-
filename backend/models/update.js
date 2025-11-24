"use strict";

const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const CommentSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const UpdateSchema = new Schema(
  {
    author: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, trim: true, maxlength: 200 },
    body: { type: String, trim: true, maxlength: 5000 },
    images: [{ type: String }],
    likes: [{ type: Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Update || mongoose.model("Update", UpdateSchema);
