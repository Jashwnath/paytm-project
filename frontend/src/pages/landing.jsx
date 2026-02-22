import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold text-blue-700">Paytm Clone</h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-700 font-semibold"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16">
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold text-gray-800 leading-tight">
            Fast. Secure.{" "}
            <span className="text-blue-600">Digital Payments.</span>
          </h2>

          <p className="text-gray-600 mt-6 text-lg">
            Send money instantly, check balances, and manage transactions
            effortlessly. Built with modern full-stack technology.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/signin")}
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition"
            >
              Login
            </button>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1563986768609-322da13575f3"
          alt="Mobile payment"
          className="w-96 mt-12 md:mt-0 rounded-2xl shadow-2xl"
        />
      </div>

      {/* FEATURES SECTION */}
      <div className="px-10 md:px-20 py-20 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose Us?
        </h3>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-xl transition">
            <h4 className="text-xl font-semibold text-blue-700 mb-3">
              Instant Transfers
            </h4>
            <p className="text-gray-600">
              Send and receive money within seconds using a reliable backend
              system.
            </p>
          </div>

          <div className="p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-xl transition">
            <h4 className="text-xl font-semibold text-blue-700 mb-3">
              Secure Authentication
            </h4>
            <p className="text-gray-600">
              JWT-based secure login and protected transaction routes.
            </p>
          </div>

          <div className="p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-xl transition">
            <h4 className="text-xl font-semibold text-blue-700 mb-3">
              Real-Time Balance
            </h4>
            <p className="text-gray-600">
              Fetch updated balance dynamically from MongoDB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
