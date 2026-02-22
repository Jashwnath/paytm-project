import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";

export const Dashboard = () => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/api/v1/account/balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setBalance(res.data.balance);
    };
    fetchBalance();
  }, []);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={balance === null ? "Loading..." : `₹${balance}`} />
        <Users />
      </div>
    </div>
  );
};
