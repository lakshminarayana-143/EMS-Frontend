import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminAccessCheck = () => {
  const [accessPassword, setAccessPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/admin/check-password", {
        accessPassword,
      });

      if (res.data.success) {
        navigate("/admin/register", { state: { fromAccessCheck: true } });
      } else {
        setError("Password doesn't match. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          🔐 Admin Access Verification
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Please enter the Admin password to proceed with admin signup.
        </p>

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Access Password</label>
          <input
            type="password"
            placeholder="Enter master password"
            value={accessPassword}
            onChange={(e) => setAccessPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify Password"}
        </button>

        {error && (
          <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
        )}
      </form>
    </div>
  );
};

export default AdminAccessCheck;
