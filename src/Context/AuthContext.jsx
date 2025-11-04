import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
  const syncAuth = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    setUser(storedUser || null);
    setToken(storedToken || null);
  };

  syncAuth();
  window.addEventListener("storage", syncAuth);
  return () => window.removeEventListener("storage", syncAuth);
}, []);

  
  const register = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Sign up failed");

      return data;
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

//   const login = async (formData) => {
//   const response = await fetch(`${import.meta.env.VITE_BASE_URL}/signin`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(formData),
//   });

//   const data = await response.json();
//   if (!response.ok) throw new Error(data.message || "Login failed");

//   setUser(data.user);
//   setToken(data.token);

//   localStorage.setItem("user", JSON.stringify(data.user));
//   localStorage.setItem("token", data.token);
//   localStorage.setItem("userId", data.user._id || data.user.id);
//   console.log("LocalStorage token:", localStorage.getItem("token"));
//   console.log("LocalStorage user:", localStorage.getItem("user"));

//   return data;
// };

const login = async (formData) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");

  localStorage.clear();
  sessionStorage.clear();

  setUser(data.user);
  setToken(data.token);

  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.user._id || data.user.id);

  console.log(data);
  
  return data;
};

  // Logout function
  const logout = () => {
  setUser(null);
  setToken(null);
  localStorage.clear();
  sessionStorage.clear();
};



  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};