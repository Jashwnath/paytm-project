import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Profile = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // GET USER NAME
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const handlePasswordChange = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      console.log(response.data);

      alert(response.data.message);

      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Password update failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Account Settings
        </h2>

        {/* USER NAME */}
        <p className="text-center text-gray-600 mb-6">
          Logged in as <span className="font-semibold">{user?.name}</span>
        </p>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Current Password</label>

          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />

          <label className="block mt-4 mb-2 font-medium">New Password</label>

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />

          <button
            onClick={handlePasswordChange}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
