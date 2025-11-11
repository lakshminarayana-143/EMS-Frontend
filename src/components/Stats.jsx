import React from "react";

export default function Stats({ total, avgSalary, departments }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-600 mb-1">Total Employees</div>
        <div className="text-3xl font-bold text-indigo-600">{total}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-600 mb-1">Average Salary</div>
        <div className="text-3xl font-bold text-green-600">
          ₹ {avgSalary.toLocaleString()}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-600 mb-1">Departments</div>
        <div className="text-3xl font-bold text-purple-600">{departments}</div>
      </div>
    </div>
  );
}
