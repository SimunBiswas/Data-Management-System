import { useState } from "react";
import { uploadDocument } from "../api/api";

export default function UploadFile({ token }) {
  const [file, setFile] = useState(null);
  // const [remarks, setRemarks] = useState("");
  // const [loading, setLoading] = useState(false);
  const [majorHead, setMajorHead] = useState("");
  const [minorHead, setMinorHead] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [documenRemarks, setDocumentRemark] = useState("");
  const [tags, setTags] = useState([]);
  const [userId, setUserId] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    const data = {
      file,
      major_head: majorHead || "Company",
      minor_head: minorHead || "Work Order",
      document_date: documentDate || "12-02-2024",
      document_remarks: documenRemarks || "No remarks",
      tags: tags.length > 0 ? tags.map((t) => ({ tag_name: t })) : [{ tag_name: "" }],
      user_id: userId || "nitin",
    };

    setLoading(true);
    const res = await uploadDocument(token, file, data);
    setLoading(false);

    alert(res.data || "File uploaded successfully!");
  };

  return (
    <div className="p-6 max-w-md mx-auto border rounded-lg mt-10 bg-white shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Upload Document</h2>
      <input
        type="text"
        value={majorHead}
        onChange={(e) => setMajorHead(e.target.value)}
        className="mb-3"
      />
      <input
        type="text"
        value={minorHead}
        onChange={(e) => setMinorHead(e.target.value)}/>

      <input
        type="date"
        value={documentDate}
        onChange={(e) => setDocumentDate(e.target.value)}
        className="form-control"
      />
      {/* <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          /> */}

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
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
        className="bg-purple-500 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
}
