import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employeeService";
import Header from "../components/Header";
import Stats from "../components/Stats";
import SearchBar from "../components/SearchBar";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeModal from "../components/EmployeeModal";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [adminId, setAdminId] = useState(null);
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
  const [errors, setErrors] = useState({});

  const departments = [
    "Engineering",
    "Marketing",
    "HR",
    "Sales",
    "Finance",
    "Operations",
  ];

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await axios.get(
        "https://ems-backend-7dly.onrender.com/api/admin/check-auth",
        { withCredentials: true }
      );
      setAdminId(res.data.admin.id);
    } catch (err) {
      console.error("Failed to fetch admin:", err);
    }
  };

  useEffect(() => {
    if (adminId) loadEmployees();
  }, [adminId]);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees(adminId);
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
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData(emp);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(adminId, id);
        setEmployees((prev) => prev.filter((e) => e._id !== id));
      } catch (error) {
        console.error("Failed to delete employee:", error);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (
      !editingEmployee &&
      employees.some((e) => e.email.toLowerCase() === formData.email.toLowerCase())
    ) {
      newErrors.email = "Email already exists";
    }

    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.salary || formData.salary <= 0)
      newErrors.salary = "Enter a valid salary";
    if (!formData.joinDate) newErrors.joinDate = "Join date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingEmployee) {
        const updated = await updateEmployee(adminId, editingEmployee._id, formData);
        setEmployees((prev) =>
          prev.map((e) => (e._id === updated._id ? updated : e))
        );
      } else {
        const newEmp = await addEmployee(adminId, formData);
        setEmployees((prev) => [...prev, newEmp]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: employees.length,
    avgSalary:
      employees.length > 0
        ? Math.round(
            employees.reduce((sum, e) => sum + Number(e.salary), 0) /
              employees.length
          )
        : 0,
    departments: [...new Set(employees.map((e) => e.department))].length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header onAdd={handleAdd} />
        <Stats {...stats} />
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <EmployeeTable
          employees={filteredEmployees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <EmployeeModal
          show={showModal}
          onClose={() => setShowModal(false)}
          formData={formData}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          onSubmit={handleSubmit}
          editingEmployee={editingEmployee}
          departments={departments}
          errors={errors}
        />
      </div>
    </div>
  );
}
