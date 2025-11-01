import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X, Save, Users } from "lucide-react";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "./api/employeeService";
import "../src/App.css";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: "",
    joinDate: "",
  });

  const departments = [
    "Engineering",
    "Marketing",
    "HR",
    "Sales",
    "Finance",
    "Operations",
  ];

  // Load employees from backend
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employees:", error);
    }
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      department: "",
      position: "",
      salary: "",
      joinDate: "",
    });
    setShowModal(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      } catch (error) {
        console.error("Failed to delete employee:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.department ||
      !formData.position ||
      !formData.salary ||
      !formData.joinDate
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editingEmployee) {
        const updated = await updateEmployee(editingEmployee._id, formData);
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === updated._id ? updated : emp))
        );
      } else {
        const newEmp = await addEmployee(formData);
        setEmployees((prev) => [...prev, newEmp]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: employees.length,
    avgSalary:
      employees.length > 0
        ? Math.round(
            employees.reduce((sum, emp) => sum + Number(emp.salary), 0) /
              employees.length
          )
        : 0,
    departments: [...new Set(employees.map((emp) => emp.department))].length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Employee Management System
              </h1>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Employees</div>
            <div className="text-3xl font-bold text-indigo-600">
              {stats.total}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Average Salary</div>
            <div className="text-3xl font-bold text-green-600">
              ${stats.avgSalary.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Departments</div>
            <div className="text-3xl font-bold text-purple-600">
              {stats.departments}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No employees found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        ${employee.salary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.joinDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingEmployee ? "Edit Employee" : "Add New Employee"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {["name", "email", "position", "salary", "joinDate"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === "salary" ? "number" : field === "joinDate" ? "date" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
