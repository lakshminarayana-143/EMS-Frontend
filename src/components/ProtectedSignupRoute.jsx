import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedSignupRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // 1️⃣ Check if any admin exists
        const checkAdmin = await axios.get("http://localhost:5000/api/admin/check-admin", {
          withCredentials: true,
        });

        if (!checkAdmin.data.adminExists) {
          // 🚀 No admin → allow signup without token
          console.log("✅ No admin exists — allowing direct signup");
          setAllowed(true);
          return;
        }

        // 2️⃣ Admin exists → require access token
        const res = await axios.get("http://localhost:5000/api/admin/check-access", {
          withCredentials: true,
        });

        if (res.data.success) {
          console.log("✅ Token verified — signup allowed");
          setAllowed(true);
        } else {
          console.log("❌ Token invalid — redirecting to access check");
          setAllowed(false);
        }
      } catch (err) {
        console.error("Error verifying signup access:", err);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Checking signup access...
      </div>
    );
  }

  if (!allowed) {
    // Redirect to master password screen if needed
    return <Navigate to="/admin/access-check" replace />;
  }

  // ✅ Allow rendering signup component
  return children;
}
