import { useState } from "react";
import { uploadDocument } from "../api/api";

export default function UploadFile({ token }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [majorHead, setMajorHead] = useState("Personal");
  const [minorHead, setMinorHead] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [userId, setUserId] = useState("");

  const minorOptions =
  majorHead === "Personal"
    ? ["John", "Tom", "Emily", "Simun"]
    : ["Accounts", "HR", "IT", "Finance"];

// Add a tag
const addTag = () => {
  if (tagInput && !tags.includes(tagInput)) {
    setTags([...tags, tagInput]);
    setTagInput("");
  }
};

 // Remove a tag
 const removeTag = (t) => {
  setTags(tags.filter((tag) => tag !== t));
};


  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    const data = {
      file,
      major_head: majorHead || "Company",
      minor_head: minorHead || "Work Order",
      document_date: documentDate || "12-02-2024",
      document_remarks: remarks || "No remarks",
      tags: tags.length > 0 ? tags.map((t) => ({ tag_name: t })) : [{ tag_name: "" }],
      user_id: userId || "nitin",
    };

    setLoading(true);
    try {
      // const res = await uploadDocument(token, file, data);
      await uploadDocument(token, file, data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto border rounded-lg mt-10 bg-white shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Upload Document</h2>

      <div className="mb-3">
        <label htmlFor="majorHead">Major Head</label>
        <select
            className="form-select"
            value={majorHead}
            onChange={(e) => {
              setMajorHead(e.target.value);
              setMinorHead(""); // reset minor on major change
            }}
          >
            <option>Personal</option>
            <option>Professional</option>
          </select>
      </div>

      <div className="col-md-3 mb-2">
          <label>{majorHead === "Personal" ? "Name" : "Department"}</label>
          <select
            className="form-select"
            value={minorHead}
            onChange={(e) => setMinorHead(e.target.value)}
          >
            <option value="">Select...</option>
            {minorOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

      <div className="mb-3">
        <label >Document Date</label>
        <input
          type="date"
          id="documentDate"
          value={documentDate}
          onChange={(e) => setDocumentDate(e.target.value)}
          className="border w-full p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="border w-full p-2 rounded"
        />
      </div>

       {/* Tags */}
       <div className="mt-3">
        <label>Tags</label>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
          />
          <button className="btn btn-secondary" onClick={addTag}>
            Add
          </button>
        </div>
        <div className="mt-2">
          {tags.map((t) => (
            <span key={t} className="badge bg-info me-2">
              {t}{" "}
              <button
                type="button"
                className="btn-close btn-close-white btn-sm ms-1"
                aria-label="Remove"
                onClick={() => removeTag(t)}
              ></button>
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label>Name : </label>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value.toLowerCase())}
          className="border w-full p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
          accept=".pdf,.png,.jpg,.jpeg"
        />
      </div>

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
