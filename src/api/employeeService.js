import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "https://ems-backend-7.onrender.com/api/employees";

// ------------------------------
// GET EMPLOYEES
// ------------------------------
export const getEmployees = async () => {
  const res = await axios.get(API_URL, {
    withCredentials: true,
  });
  return res.data;
};

// ------------------------------
// ADD EMPLOYEE
// ------------------------------
export const addEmployee = async (employee) => {
  const res = await axios.post(API_URL, employee, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// ------------------------------
// UPDATE EMPLOYEE
// ------------------------------
export const updateEmployee = async (id, employee) => {
  const res = await axios.put(`${API_URL}/${id}`, employee, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// ------------------------------
// DELETE EMPLOYEE
// ------------------------------
export const deleteEmployee = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
  return res.data;
};
