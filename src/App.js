// src/App.js
import React, { useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import FileSearch from './components/FileSearch';
import UploadFile from './components/UploadFile';
import  Navbar from './components/Navbar';

const AppRoutes = () => {
    
  const { token } = useContext(AuthContext);

  return (
    <div style={{ "background" : "#475586"}}
    className='vh-100'>
      <Navbar/>
      <Routes>
      {token === null ? (
        // 🔸 If user is not logged in → show Login
        <Route path="/" element={<Login />} />
      ) : (
        // 🔸 If logged in → allow Upload & Search
        <>
          <Route path="/upload" element={<UploadFile token={token} />} />
          <Route path="/search" element={<FileSearch token={token} />} />
          <Route path="*" element={<Navigate to="/upload" replace />} />
        </>
      )}
    </Routes>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}