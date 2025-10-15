import axios from "axios";

import { API_URL } from "./constants";

export const login = async (email, password) => {
  const response = await axios.post(API_URL + "users/login", {
    email,
    password,
  });
  return response.data;
};

export const signup = async (name, email, password) => {
  const response = await axios.post(API_URL + "users/signup", {
    name,
    email,
    password,
  });
  return response.data;
};

export const getAllUsers = async (token) => {
  const response = await axios.get(API_URL + "users", {
    headers: { Authorization: "Bearer " + token },
  });
  return response.data;
};

// ✅ Update user role (e.g., change user → employer)
export const updateUserRole = async (id, role, token) => {
  const response = await axios.put(
    API_URL + "users/" + id,
    { role },
    { headers: { Authorization: "Bearer " + token } }
  );
  return response.data;
};

// ✅ Delete user
export const deleteUser = async (id, token) => {
  const response = await axios.delete(API_URL + "users/" + id, {
    headers: { Authorization: "Bearer " + token },
  });
  return response.data;
};
