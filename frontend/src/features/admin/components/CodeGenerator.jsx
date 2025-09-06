import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateAdminCode,
  generateModeratorCode,
  deleteCode,
  fetchCodes,
} from "../slices/adminSlice";
import Loader from "../../../components/common/Loader";
import TimeAgo from "../../../components/common/TimeAgo";
import { Trash2 } from "lucide-react";
import ShowHideText from "../../../components/common/ShowHideText";
import CopyText from "../../../components/common/CopyText";

export default function CodeGenerator() {
  const dispatch = useDispatch();
  const { codes = [], loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchCodes());
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Code Generator</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => dispatch(generateAdminCode())}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          Generate Admin Code
        </button>
        <button
          onClick={() => dispatch(generateModeratorCode())}
          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
        >
          Generate Moderator Code
        </button>
      </div>

      {loading && <Loader text="Loading..." />}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/10 text-left">
              <th className="p-3">Code</th>
              <th className="p-3">Role</th>
              <th className="p-3">Expires</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(codes || []).length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-400">
                  No codes generated yet
                </td>
              </tr>
            ) : (
              (codes || []).map((c) => (
                <tr
                  key={c._id || c.code}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <ShowHideText text={c.code} />
                      <CopyText text={c.code} />
                    </div>
                  </td>
                  <td className="p-3 capitalize">{c.role}</td>
                  <td className="p-3">
                    <TimeAgo date={c.expiresAt} />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => dispatch(deleteCode(c._id))}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
