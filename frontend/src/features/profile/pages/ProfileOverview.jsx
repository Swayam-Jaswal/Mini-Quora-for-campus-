import { useDispatch } from "react-redux";
import { useState } from "react";
import { updateProfile } from "../slices/profileSlice";
import ProfileEditModal from "../components/ProfileEditModal";
import ProfileAvatarUpload from "../components/ProfileAvtarUpload";

export default function ProfileOverview({ profile }) {
  const dispatch = useDispatch();
  const [editingField, setEditingField] = useState(null); // "bio" | "skills" | "social"
  const [form, setForm] = useState({
    name: profile.name,
    bio: profile.bio || "",
    skills: profile.skills || [],
    social: profile.social || {},
    avatar: profile.avatar,
  });

  const handleSave = (field, value) => {
    setForm({ ...form, [field]: value });
    dispatch(updateProfile({ ...form, [field]: value }));
    setEditingField(null);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-black/30 p-6 rounded-2xl flex items-center gap-6 shadow-lg">
        <ProfileAvatarUpload
          current={form.avatar}
          onChange={(url) => handleSave("avatar", url)}
        />
        <div>
          <h2 className="text-2xl font-bold">{form.name}</h2>
          <p className="text-gray-400">{profile.email}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-blue-600/30 text-blue-300">
            {profile.role}
          </span>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-black/20 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Bio</h3>
          <button
            onClick={() => setEditingField("bio")}
            className="text-sm text-blue-400 hover:underline"
          >
            {form.bio ? "Edit" : "Add Bio"}
          </button>
        </div>
        <p className="text-gray-300">{form.bio || "No bio added yet."}</p>
      </div>

      {/* Skills */}
      <div className="bg-black/20 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Skills</h3>
          <button
            onClick={() => setEditingField("skills")}
            className="text-sm text-blue-400 hover:underline"
          >
            {form.skills?.length ? "Edit" : "Add Skills"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.skills?.length ? (
            form.skills.map((s, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-gray-700 text-sm">
                {s}
              </span>
            ))
          ) : (
            <p className="text-gray-300">No skills added yet.</p>
          )}
        </div>
      </div>

      {/* Social */}
      <div className="bg-black/20 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Social Links</h3>
          <button
            onClick={() => setEditingField("social")}
            className="text-sm text-blue-400 hover:underline"
          >
            Edit
          </button>
        </div>
        <ul className="space-y-1 text-gray-300">
          {["github", "linkedin", "twitter"].map((s) => (
            <li key={s}>
              <span className="capitalize">{s}: </span>
              {form.social[s] ? (
                <a
                  href={form.social[s]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {form.social[s]}
                </a>
              ) : (
                <span className="text-gray-500">Not added</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        open={!!editingField}
        onClose={() => setEditingField(null)}
        title={
          editingField === "bio"
            ? "Edit Bio"
            : editingField === "skills"
            ? "Edit Skills (comma separated)"
            : "Edit Social Links (JSON format)"
        }
        initialValue={
          editingField === "bio"
            ? form.bio
            : editingField === "skills"
            ? form.skills.join(", ")
            : JSON.stringify(form.social, null, 2)
        }
        onSave={(val) => {
          if (editingField === "skills") {
            handleSave("skills", val.split(",").map((s) => s.trim()).filter(Boolean));
          } else if (editingField === "social") {
            try {
              handleSave("social", JSON.parse(val));
            } catch {
              toast.error("Invalid JSON for social links");
            }
          } else {
            handleSave(editingField, val);
          }
        }}
      />
    </div>
  );
}
