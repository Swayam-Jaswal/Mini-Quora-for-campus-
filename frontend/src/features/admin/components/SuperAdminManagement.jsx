import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  demoteAdmin,
  deleteUser,
} from "../slices/adminSlice";
import Loader from "../../../components/common/Loader";
import TimeAgo from "../../../components/common/TimeAgo";
import ConfirmActionModal from "../../../components/common/ConfirmActionModal";

export default function SuperAdminManagement() {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((s) => s.admin);

  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState(null); // { type, userId }

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleConfirm = () => {
    if (!action) return;
    if (action.type === "demote") {
      dispatch(demoteAdmin(action.userId));
    } else if (action.type === "delete") {
      dispatch(deleteUser(action.userId));
    }
    setModalOpen(false);
    setAction(null);
  };

  if (loading) return <Loader text="Loading admins..." />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const admins = users.filter((u) => u.role === "admin");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Management (Superadmin)</h2>
      <p className="text-gray-400 mb-3">Total admins: {admins.length}</p>

      {admins.length === 0 ? (
        <p className="text-gray-400">No admins found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/10 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-gray-300">{u.email}</td>
                  <td className="p-3">
                    <TimeAgo date={u.createdAt} />
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => {
                        setAction({ type: "demote", userId: u._id });
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-sm"
                    >
                      Demote to User
                    </button>
                    <button
                      onClick={() => {
                        setAction({ type: "delete", userId: u._id });
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmActionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setAction(null);
        }}
        onConfirm={handleConfirm}
        title={
          action?.type === "demote" ? "Demote Admin" : "Delete Admin"
        }
        description={
          action?.type === "demote"
            ? "Type 'demote admin' to confirm demotion."
            : "Type 'delete admin' to confirm deletion."
        }
        confirmWord={
          action?.type === "demote" ? "demote admin" : "delete admin"
        }
      />
    </div>
  );
}
