import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminEntry() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/check-admin", {
          withCredentials: true,
        });

        if (res.data.adminExists) {
          // ✅ Admin already exists → go to login
          navigate("/admin/login");
        } else {
          // ✅ No admin → go directly to signup (skip access check)
          navigate("/admin/register", { state: { fromEntry: true } });
        }
      } catch (err) {
        console.error("Error checking admin:", err);
        navigate("/admin/register", { state: { fromEntry: true } }); // fallback
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking admin setup...
      </div>
    );
  }

  return null;
}
