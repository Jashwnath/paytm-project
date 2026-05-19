import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 5;

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/bulk?filter=` + filter,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      )
      .then((response) => {
        setUsers(response.data.user);

        // reset pagination on search
        setCurrentPage(1);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [filter]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(users.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>

      <div className="my-2">
        <input
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>

      <div>
        {currentUsers.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded text-white
          ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-black"}`}
        >
          Prev
        </button>

        <span className="font-medium">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 rounded text-white
          ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
};

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between py-2">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0]}
          </div>
        </div>

        <div className="flex flex-col justify-center h-full">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-full">
        <Button
          onClick={() => {
            navigate("/send?id=" + user._id + "&name=" + user.firstName);
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
