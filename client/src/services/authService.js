import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Login
export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

// Register
export const registerUser = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

// Forgot Password
export const forgotPassword = async (data) => {
  const response = await API.post("/auth/forgot-password", data);
  return response.data;
};

// Reset Password
export const resetPassword = async (token, data) => {
  const response = await API.post(
    `/auth/reset-password/${token}`,
    data
  );
  return response.data;
};

// Verify Email
export const verifyEmail = async (token) => {
  const response = await API.get(
    `/auth/verify-email/${token}`
  );
  return response.data;
};

// Get Current User
export const getCurrentUser = async (token) => {
  const response = await API.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Update Profile
export const updateProfile = async (token, data) => {
  const response = await API.patch(
    "/user/profile",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export default API;