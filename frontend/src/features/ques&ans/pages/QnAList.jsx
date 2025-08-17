import React from "react";
import Navbar from "../../../components/layout/Navbar";
import QuestionCard from "../components/QuestionCard";
import AnswerCard  from "../components/AnswerCard";
import QuestionForm from "../components/QuestionForm";
import AnswerForm from "../components/AnswerForm";

export default function QnaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />

      <div className="flex flex-1 px-6 py-6 gap-6">
        <aside className="w-1/5 bg-black/20 rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li><button className="w-full text-left hover:text-gray-300">All Questions</button></li>
            <li><button className="w-full text-left hover:text-gray-300">My Questions</button></li>
            <li><button className="w-full text-left hover:text-gray-300">AI Assistant</button></li>
          </ul>
        </aside>

        <main className="flex-1 flex flex-col gap-6">
          <QuestionForm />

          <div className="bg-black/20 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Discussion</h2>
            
            <QuestionCard
              title="What is the best way to prepare for mid-sem exams?"
              body="I am new to university life and I want some tips on how to manage studies effectively."
              author={{ name: "John Doe", role: "student" }}
              tags={["exams", "study-tips"]}
              date="2 days ago"
            />

            <div className="mt-4 space-y-4">
              <AnswerCard
                body="Make a timetable and revise daily. Don’t leave things for the last moment."
                author={{ name: "Alice", role: "student" }}
                date="1 day ago"
              />
              <AnswerCard
                body="Form small study groups, they really help with sharing knowledge."
                author={{ name: "Professor Smith", role: "faculty" }}
                date="22 hours ago"
              />
            </div>

            <div className="mt-6">
              <AnswerForm />
            </div>
          </div>
        </main>

        <aside className="w-1/5 bg-black/20 rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Trending Tags</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-500/30 rounded-full text-sm">#exams</span>
            <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm">#assignments</span>
            <span className="px-3 py-1 bg-pink-500/30 rounded-full text-sm">#events</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
