import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const [amount, setAmount] = useState("");

  // OTP STATES
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // UI STATES
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     SEND OTP
  ========================= */

  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);

      setError(null);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/account/send-otp`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      alert(response.data.message);

      setOtpSent(true);
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  /* =========================
     TRANSFER MONEY
  ========================= */

  const handleTransfer = async () => {
    try {
      setLoading(true);

      setError(null);

      setSuccess(false);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/account/transfer`,
        {
          to: id,
          amount: Number(amount),
          otp,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      setSuccess(true);

      alert(response.data.message);

      // RESET
      setAmount("");
      setOtp("");
      setOtpSent(false);
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border max-w-md p-6 space-y-6 w-96 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center">Send Money</h2>

          {/* USER INFO */}

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-2xl text-white">
                {name?.[0]?.toUpperCase()}
              </span>
            </div>

            <h3 className="text-2xl font-semibold">{name}</h3>
          </div>

          {/* AMOUNT */}

          <div className="space-y-4">
            <label className="text-sm font-medium">Amount (in Rs)</label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-10 w-full rounded-md border px-3 text-sm"
              placeholder="Enter amount"
            />

            {/* SEND OTP BUTTON */}

            {!otpSent && (
              <button
                onClick={handleSendOtp}
                disabled={sendingOtp || !amount}
                className={`h-10 w-full rounded-md text-white
                ${
                  sendingOtp || !amount
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {sendingOtp ? "Sending OTP..." : "Send OTP"}
              </button>
            )}

            {/* OTP INPUT */}

            {otpSent && (
              <>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="h-10 w-full rounded-md border px-3 text-sm"
                  placeholder="Enter 4 digit OTP"
                />

                {/* CONFIRM PAYMENT */}

                <button
                  onClick={handleTransfer}
                  disabled={loading || otp.length !== 4}
                  className={`h-10 w-full rounded-md text-white
                  ${
                    loading || otp.length !== 4
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {loading ? "Processing..." : "Confirm Payment"}
                </button>
              </>
            )}
          </div>

          {/* SUCCESS */}

          {success && (
            <div className="bg-green-100 text-green-700 text-center p-2 rounded-md">
              ✅ Transaction completed successfully
            </div>
          )}

          {/* ERROR */}

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
