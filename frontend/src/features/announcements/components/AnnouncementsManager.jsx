import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../slice/announcementsSlice";
import * as LucideIcons from "lucide-react"; // ✅ import all icons
import {
  Megaphone,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import ConfirmModal from "../../../components/common/ConfirmModal";
import AnnouncementEditModal from "../../../components/common/AnnouncementEditModal";

export default function AnnouncementsManager() {
  const dispatch = useDispatch();
  const { items: announcements, loading } = useSelector(
    (state) => state.announcements
  );

  const [form, setForm] = useState({ text: "", type: "info" });

  // delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    dispatch(createAnnouncement(form));
    setForm({ text: "", type: "info" });
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteAnnouncement(deleteId));
      setDeleteId(null);
      setConfirmOpen(false);
    }
  };

  const openEditModal = (announcement) => {
    setEditData(announcement);
    setEditOpen(true);
  };

  const handleUpdate = (data) => {
    if (editData?._id) {
      dispatch(
        updateAnnouncement({
          id: editData._id,
          text: data.text,
          type: data.type,
        })
      );
      setEditOpen(false);
      setEditData(null);
    }
  };

  // ✅ Utility to render icon dynamically
  const renderIcon = (type) => {
    const iconMap = {
      alert: "AlertTriangle",
      deadline: "FileText",
      info: "Info",
    };
    const IconComponent = LucideIcons[iconMap[type] || "Info"];
    return <IconComponent size={18} className="text-blue-400" />;
  };

  return (
    <div>
      <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 text-white">
        <Megaphone size={28} className="text-blue-400" />
        Manage Announcements
      </h2>

      {/* Create form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-3 mb-8 bg-black/30 p-4 rounded-xl shadow-lg"
      >
        <input
          type="text"
          placeholder="Enter announcement..."
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          className="p-3 rounded-xl bg-gray-800 text-white flex-1 outline-none border border-gray-700 focus:border-blue-400 transition"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-blue-400 transition"
        >
          <option value="info">Info</option>
          <option value="deadline">Deadline</option>
          <option value="alert">Alert</option>
        </select>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition"
        >
          <Plus size={18} /> Add
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((a) => (
            <li
              key={a._id}
              className="flex justify-between items-center bg-black/40 hover:bg-black/50 p-4 rounded-xl shadow-md transition"
            >
              <div className="flex items-center gap-3">
                {renderIcon(a.type)}
                <span className="text-sm md:text-base">{a.text}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(a)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => openDeleteModal(a._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Confirm delete modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Edit modal */}
      <AnnouncementEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={editData}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
