import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, promoteUser } from "../slices/adminSlice";
import Loader from "../../../components/common/Loader";
import TimeAgo from "../../../components/common/TimeAgo";

export default function UserManagement() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <Loader text="Loading users..." />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

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
              <tr key={u._id} className="border-b border-white/10 hover:bg-white/5">
                <td className="p-3">{u.name}</td>
                <td className="p-3 text-gray-300">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3"><TimeAgo date={u.createdAt} /></td>
                <td className="p-3 space-x-2">
                  {u.role === "user" && (
                    <button
                      onClick={() => dispatch(promoteUser(u._id))}
                      className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-sm"
                    >
                      Promote to Moderator
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
