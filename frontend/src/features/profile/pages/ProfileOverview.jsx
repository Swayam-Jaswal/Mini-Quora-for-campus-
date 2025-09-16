// src/features/profile/pages/ProfileOverview.jsx
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateProfile } from "../slices/profileSlice";
import ProfileEditModal from "../components/ProfileEditModal";
import SkillsEditModal from "../components/SkillsEditModal";

// ✅ shared icons
import { uiIcons } from "../utils/Icons";
import { FaUser, FaCode, FaChartBar, FaUsers } from "react-icons/fa";
import FadeIn from "../components/FadeIn";

export default function ProfileOverview({ profile }) {
  const dispatch = useDispatch();
  const [editingField, setEditingField] = useState(null);
  const [form, setForm] = useState({
    bio: profile.bio || "",
    skills: profile.skills || [],
    social: profile.social || {},
  });

  const handleSave = (field, value) => {
    setForm({ ...form, [field]: value });
    dispatch(updateProfile({ [field]: value }));
    setEditingField(null);
  };

  const AddIcon = uiIcons.add;
  const EditIcon = uiIcons.edit;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Bio */}
      <FadeIn>
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 transition hover:border-blue-500/30">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaUser className="text-blue-400" /> About Me
            </h3>
            <button
              onClick={() => setEditingField("bio")}
              className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition"
            >
              {form.bio ? (
                <>
                  <EditIcon size={14} /> Edit
                </>
              ) : (
                <>
                  <AddIcon size={14} /> Add
                </>
              )}
            </button>
          </div>
          {form.bio ? (
            <p className="text-gray-200 leading-relaxed">{form.bio}</p>
          ) : (
            <p className="text-gray-500 italic">
              No bio yet. Click add to tell us about yourself.
            </p>
          )}
        </div>
      </FadeIn>

      {/* Skills */}
      <FadeIn delay={0.1}>
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 transition hover:border-blue-500/30">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaCode className="text-green-400" /> Skills
            </h3>
            <button
              onClick={() => setEditingField("skills")}
              className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 transition"
            >
              {form.skills?.length ? (
                <>
                  <EditIcon size={14} /> Edit
                </>
              ) : (
                <>
                  <AddIcon size={14} /> Add
                </>
              )}
            </button>
          </div>
          {form.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {form.skills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-200 border border-blue-500/30 text-sm shadow-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No skills yet. Click add to list your skills.</p>
          )}
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.2}>
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <FaChartBar className="text-yellow-400" /> Stats
          </h3>
          <p className="text-gray-500 italic">User stats will be shown here.</p>
        </div>
      </FadeIn>

      {/* Contributions */}
      <FadeIn delay={0.3}>
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <FaUsers className="text-pink-400" /> User Contribution
          </h3>
          <p className="text-gray-500 italic">User contributions will be shown here.</p>
        </div>
      </FadeIn>

      {/* Skills Modal */}
      {editingField === "skills" && (
        <SkillsEditModal
          open={true}
          onClose={() => setEditingField(null)}
          initialSkills={form.skills}
          onSave={(skills) => handleSave("skills", skills)}
        />
      )}

      {/* Edit Modal */}
      {editingField && editingField !== "skills" && (
        <ProfileEditModal
          open={!!editingField}
          onClose={() => setEditingField(null)}
          title={editingField === "bio" ? "Edit Bio" : "Edit Social Links (JSON format)"}
          initialValue={
            editingField === "bio" ? form.bio : JSON.stringify(form.social, null, 2)
          }
          onSave={(val) => {
            if (editingField === "social") {
              try {
                const parsed = JSON.parse(val);
                handleSave("social", parsed);
              } catch {
                toast.error("Invalid JSON for social links");
              }
            } else {
              handleSave(editingField, val);
            }
          }}
        />
      )}
    </div>
  );
}
