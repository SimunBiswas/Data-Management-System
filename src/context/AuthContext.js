import { createContext, useState } from 'react';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const storedData = JSON.parse(localStorage.getItem("userData")) || {};
    const [token, setToken] = useState(storedData.token || null);
    const [user, setUser] = useState({
      user_id: storedData.user_id || null,
      user_name: storedData.user_name || null,
    });
  
    // Store Token & User Data
    const saveToken = (tokenValue, userData = {}) => {
      setToken(tokenValue);
      setUser(userData);
      localStorage.setItem(
        "userData",
        JSON.stringify({ token: tokenValue, ...userData })
      );
    };
  
    // Remove Token
    const logout = () => {
      setToken(null);
      setUser({ user_id: null, user_name: null });
      localStorage.removeItem("userData");
    };
  
    return (
      <AuthContext.Provider value={{ token, user, saveToken, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  