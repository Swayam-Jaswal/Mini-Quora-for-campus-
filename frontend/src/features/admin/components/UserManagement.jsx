import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  promoteUser,
  demoteUser,
  deleteUser,
  promoteAdmin,
  demoteAdmin,
} from "../slices/adminSlice";
import Loader from "../../../components/common/Loader";
import TimeAgo from "../../../components/common/TimeAgo";
import ConfirmActionModal from "../../../components/common/ConfirmActionModal";

export default function UserManagement() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((s) => s.auth);
  const { users = [], loading, error, totalUsers } = useSelector((s) => s.admin);

  const role = currentUser?.role || "user";
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState(null); // { type, userId }

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleConfirm = () => {
    if (!action) return;

    switch (action.type) {
      case "promoteModerator":
        dispatch(promoteUser(action.userId));
        break;
      case "demoteModerator":
        dispatch(demoteUser(action.userId));
        break;
      case "promoteAdmin":
        dispatch(promoteAdmin(action.userId));
        break;
      case "demoteAdmin":
        dispatch(demoteAdmin(action.userId));
        break;
      case "delete":
        dispatch(deleteUser(action.userId));
        break;
      default:
        break;
    }

    setModalOpen(false);
    setAction(null);
  };

  if (loading) return <Loader text="Loading users..." />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {role === "superadmin" ? "Manage Admins, Moderators & Users" : "User Management"}
      </h2>
      <p className="text-gray-400 mb-3">Total users: {totalUsers}</p>

      {users.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/10 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-gray-300">{u.email}</td>
                  <td className="p-3">
                    {u.role === "superadmin" ? (
                      <span className="px-2 py-1 bg-purple-700 rounded text-xs font-semibold">
                        SUPERADMIN
                      </span>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td className="p-3"><TimeAgo date={u.createdAt} /></td>
                  <td className="p-3 space-x-2">
                    {/* === Admins can manage moderators & users === */}
                    {role === "admin" && u.role === "user" && (
                      <button
                        onClick={() => {
                          setAction({ type: "promoteModerator", userId: u._id });
                          setModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-sm"
                      >
                        Promote to Moderator
                      </button>
                    )}
                    {role === "admin" && u.role === "moderator" && (
                      <button
                        onClick={() => {
                          setAction({ type: "demoteModerator", userId: u._id });
                          setModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-sm"
                      >
                        Demote to User
                      </button>
                    )}
                    {role === "admin" && u.role !== "admin" && u.role !== "superadmin" && (
                      <button
                        onClick={() => {
                          setAction({ type: "delete", userId: u._id });
                          setModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}

                    {/* === Superadmin full powers === */}
                    {role === "superadmin" && u.role === "user" && (
                      <button
                        onClick={() => {
                          setAction({ type: "promoteModerator", userId: u._id });
                          setModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-sm"
                      >
                        Promote to Moderator
                      </button>
                    )}
                    {role === "superadmin" && u.role === "moderator" && (
                      <>
                        <button
                          onClick={() => {
                            setAction({ type: "demoteModerator", userId: u._id });
                            setModalOpen(true);
                          }}
                          className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-sm"
                        >
                          Demote to User
                        </button>
                        <button
                          onClick={() => {
                            setAction({ type: "promoteAdmin", userId: u._id });
                            setModalOpen(true);
                          }}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm"
                        >
                          Promote to Admin
                        </button>
                      </>
                    )}
                    {role === "superadmin" && u.role === "admin" && (
                      <button
                        onClick={() => {
                          setAction({ type: "demoteAdmin", userId: u._id });
                          setModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-orange-600 hover:bg-orange-700 text-sm"
                      >
                        Demote Admin
                      </button>
                    )}
                    {role === "superadmin" && u.role !== "superadmin" && (
                      <button
                        onClick={() => {
                          setAction({ type: "delete", userId: u._id });
                          setModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Action Modal */}
      <ConfirmActionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setAction(null);
        }}
        onConfirm={handleConfirm}
        title={
          action?.type === "promoteModerator"
            ? "Promote User to Moderator"
            : action?.type === "demoteModerator"
            ? "Demote Moderator to User"
            : action?.type === "promoteAdmin"
            ? "Promote User to Admin"
            : action?.type === "demoteAdmin"
            ? "Demote Admin to User"
            : "Delete User"
        }
        description={
          action?.type === "promoteModerator"
            ? "Type 'promote moderator' to confirm."
            : action?.type === "demoteModerator"
            ? "Type 'demote user' to confirm."
            : action?.type === "promoteAdmin"
            ? "Type 'promote admin' to confirm."
            : action?.type === "demoteAdmin"
            ? "Type 'demote admin' to confirm."
            : "Type 'delete' to confirm deletion."
        }
        confirmWord={
          action?.type === "promoteModerator"
            ? "promote moderator"
            : action?.type === "demoteModerator"
            ? "demote user"
            : action?.type === "promoteAdmin"
            ? "promote admin"
            : action?.type === "demoteAdmin"
            ? "demote admin"
            : "delete"
        }
      />
    </div>
  );
}
