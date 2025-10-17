// src/api/api.js
import axios from "axios";

const API_BASE = "https://apis.allsoft.co/api/documentManagement";

// Create a reusable axios instance
export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Auth
export const generateOTP = (mobile_number) =>
  api.post("/generateOTP", { mobile_number });

export const validateOTP = async (mobile, otp) => {
  try {
    const response = await fetch("https://apis.allsoft.co/api/documentManagement/validateOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}`, // if needed
      },
      body: JSON.stringify({
        mobile_number: mobile, // make sure this matches the API
        otp: otp
      }),
    });

    // Check if HTTP status is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // parse JSON response
    console.log("Validate OTP response:", data); // log response
    return data; // return to your component
  } catch (error) {
    console.error("Error validating OTP:", error);
    return { status: false, data: error.message };
  }
};


// Logout
export const logout = () => {
  localStorage.removeItem("token");
};

// Tags
export const getDocumentTags = (token, term = "") =>
  api.post("/documentTags", { term }, { headers: { token } });

// Upload document (use FormData correctly)
export const uploadDocument = async (token, data) => {
  console.log("Uploading token with data:", token, data);
  const formData = new FormData();

  // 👇 MUST match exactly what API expects
  formData.append("file", data.file);
  formData.append(
    "data",
    JSON.stringify({
      major_head: data.major_head,
      minor_head: data.minor_head,
      document_date: data.document_date,
      document_remarks: data.document_remarks,
      tags: data.tags,
      user_id: data.user_id,
    })
  );

  // console.log("Upload Response Data from Upload:", res);


  // ⚠️ Important: DO NOT manually set Content-Type
  return api.post("/saveDocumentEntry", formData, {
    headers: {
      token,
      "Content-Type": "multipart/form-data",
    },
    
  });
};


// Search document
export const searchDocument = (token, filters) =>
  api.post("/searchDocumentEntry", filters, { headers: { token } });