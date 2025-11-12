import React from "react";
import { Users, Plus, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Header({ onAdd }) {
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await axios.post("https://ems-backend-7dly.onrender.com/api/admin/logout", {}, { withCredentials: true });
      
      navigate("/admin/login");
    } catch (error) {
      
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
       
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Management System
          </h1>
        </div>

        
        <div className="flex items-center gap-3">
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

          {/* Add Employee button */}
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
}
