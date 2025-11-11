import axios from "axios";
axios.defaults.withCredentials = true;

const API_URL = "http://localhost:5000/api/employees";

export const getEmployees = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addEmployee = async (employee) => {
  const res = await axios.post(API_URL, employee);
  return res.data;
};

export const updateEmployee = async (id, employee) => {
  const res = await axios.put(`${API_URL}/${id}`, employee);
  return res.data;
};

export const deleteEmployee = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
