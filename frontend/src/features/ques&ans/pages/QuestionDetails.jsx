import Navbar from "../../../components/layout/Navbar";
import QuestionCard from "../components/QuestionCard";

export default function QnaListPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />

      <div className="flex flex-1 px-6 py-6 gap-6">
        <aside className="w-1/5 bg-black/20 rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <ul className="space-y-3">
            <li><button className="w-full text-left hover:text-gray-300">All Questions</button></li>
            <li><button className="w-full text-left hover:text-gray-300">My Questions</button></li>
            <li><button className="w-full text-left hover:text-gray-300">Unanswered</button></li>
            <li><button className="w-full text-left hover:text-gray-300">Trending</button></li>
          </ul>
        </aside>

        <main className="flex-1 flex flex-col gap-6">
          <h2 className="text-xl font-semibold mb-4">All Questions</h2>

          <QuestionCard
            title="How do I connect MongoDB with Express?"
            body="I am building a Node.js app but having issues with MongoDB connection. Any suggestions?"
            author={{ name: "Jane Doe", role: "student" }}
            tags={["nodejs", "mongodb", "backend"]}
            date="3 hours ago"
          />

          <QuestionCard
            title="Best resources to learn Data Structures?"
            body="I am preparing for placements and need good DSA resources. Please recommend."
            author={{ name: "Rahul Kumar", role: "student" }}
            tags={["dsa", "placements"]}
            date="1 day ago"
          />

          <QuestionCard
            title="How can I improve my presentation skills?"
            body="I often get nervous during class presentations. What strategies should I follow?"
            author={{ name: "Professor Lee", role: "faculty" }}
            tags={["presentation", "soft-skills"]}
            date="2 days ago"
          />
        </main>

        <aside className="w-1/5 bg-black/20 rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Trending Tags</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-500/30 rounded-full text-sm">#nodejs</span>
            <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm">#placements</span>
            <span className="px-3 py-1 bg-pink-500/30 rounded-full text-sm">#dsa</span>
          </div>
        </aside>
      </div>
    </div>
  );
}