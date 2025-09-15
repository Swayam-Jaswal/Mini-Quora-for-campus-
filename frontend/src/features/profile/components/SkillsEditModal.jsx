// src/features/profile/components/SkillsEditModal.jsx
import { useState, useEffect } from "react";

export default function SkillsEditModal({ open, onClose, initialSkills = [], onSave }) {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (open) {
      setSkills(initialSkills);
      setNewSkill("");
    }
  }, [open, initialSkills]);

  if (!open) return null;

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(skills);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4">Edit Skills</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter a skill"
              className="flex-1 p-2 rounded-lg bg-gray-700 text-white"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
            >
              Add
            </button>
          </div>

          {/* Current skills */}
          <div className="flex flex-wrap gap-2">
            {skills.length ? (
              skills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full flex items-center gap-2"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-red-400 hover:text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </span>
              ))
            ) : (
              <p className="text-gray-400 italic">No skills added yet.</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
