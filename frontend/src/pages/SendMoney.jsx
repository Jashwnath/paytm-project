import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTransfer = async () => {
    try {
      setLoading(true);
      setError(null);

      await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        {
          to: id,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      setSuccess(true);
    } catch (err) {
      setError("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border max-w-md p-4 space-y-6 w-96 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center">Send Money</h2>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-2xl text-white">
                {name?.[0]?.toUpperCase()}
              </span>
            </div>
            <h3 className="text-2xl font-semibold">{name}</h3>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Amount (in Rs)</label>
            <input
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              className="h-10 w-full rounded-md border px-3 text-sm"
              placeholder="Enter amount"
            />

            <button
              onClick={handleTransfer}
              disabled={loading}
              className="h-10 w-full bg-green-500 text-white rounded-md"
            >
              {loading ? "Processing..." : "Initiate Transfer"}
            </button>
          </div>

          {/* ✅ SUCCESS MESSAGE */}
          {success && (
            <div className="bg-green-100 text-green-700 text-center p-2 rounded-md">
              ✅ Transaction completed successfully
            </div>
          )}

          {/* ❌ ERROR MESSAGE */}
          {error && (
            <div className="bg-red-100 text-red-700 text-center p-2 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
