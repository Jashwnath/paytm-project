import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Profile = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const handlePasswordChange = async () => {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/`,
      {
        password: password,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );

    alert("Password updated successfully");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Account Settings
        </h2>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Change Password</label>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />

          <button
            onClick={handlePasswordChange}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
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
