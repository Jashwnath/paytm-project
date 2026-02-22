import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Appbar = () => {
  const [initial, setInitial] = useState("U");
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.name) {
        setInitial(user.name.charAt(0).toUpperCase());
      }
    }
  }, []);

  return (
    <div className="shadow h-14 flex justify-between px-4">
      <div className="flex items-center font-semibold text-lg">PayTM App</div>

      <div className="flex items-center gap-3">
        <div>Hello</div>

        <button
          onClick={() => navigate("/profile")}
          className="rounded-full h-10 w-10 bg-blue-600 text-white flex items-center justify-center text-lg font-semibold"
        >
          {initial}
        </button>
      </div>
    </div>
  );
};
