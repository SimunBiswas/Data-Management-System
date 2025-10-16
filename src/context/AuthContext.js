import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(localStorage.getItem("token") || null)

    // Store Token
    const saveToken = (t) => {
        setToken(t);
        localStorage.setItem("token", t)
    }

    // Remove Token
    const logout = () => {
        setToken(null);
        localStorage.removeItem("token")
    }

    return(
        <AuthContext.Provider value={{ token, saveToken, logout }}>
            {children}
        </AuthContext.Provider>
    )
}