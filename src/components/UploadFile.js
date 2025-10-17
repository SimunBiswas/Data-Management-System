// src/components/UploadFile.jsx
import React, { useState } from "react";
import { uploadDocument } from "../api/api";

export default function UploadFile({ token }) {
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    const uploadData = {
      file,
      major_head: "Company",
      minor_head: "Work Order",
      document_date: "17-10-2025",
      document_remarks: remarks,
      tags: [{ tag_name: "RMC" }, { tag_name: "2025" }, { tag_name: "Work Order" }],
      user_id: "Simun",
    };

    try {
      setLoading(true);
      const res = await uploadDocument(token, uploadData);
      console.log("Upload Response:", res.data);
      alert("✅ File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error.response || error);
      alert("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto border rounded-lg mt-10 bg-white shadow">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Upload Document
      </h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3 w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        className="border w-full p-2 mb-3 rounded"
      />

      <button
        onClick={handleUpload}
        className={`w-full px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
        }`}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
}
