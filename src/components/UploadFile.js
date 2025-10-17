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

    
    <div className="container my-5">
  <div className="row justify-content-center">
    <div className="col-12 col-md-8 col-lg-6">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-primary text-white text-center py-3">
          <h4 className="mb-0">Upload Document</h4>
        </div>
        <div className="card-body p-4">
          <form>
            {/* Major Head */}
            <div className="mb-3">
              <label htmlFor="majorHead" className="form-label fw-semibold">Major Head</label>
              <select
                id="majorHead"
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

            {/* Minor Head */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                {majorHead === "Personal" ? "Name" : "Department"}
              </label>
              <select
                className="form-select"
                value={minorHead}
                onChange={(e) => setMinorHead(e.target.value)}
              >
                <option value="">Select...</option>
                {minorOptions.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Document Date */}
            <div className="mb-3">
              <label htmlFor="documentDate" className="form-label fw-semibold">Document Date</label>
              <input
                type="date"
                id="documentDate"
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
                className="form-control"
              />
            </div>

            {/* Remarks */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Remarks</label>
              <input
                type="text"
                placeholder="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="form-control"
              />
            </div>

            {/* Tags */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Tags</label>
              <div className="d-flex gap-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <button type="button" className="btn btn-secondary" onClick={addTag}>Add</button>
              </div>
              <div>
                {tags.map((t) => (
                  <span key={t} className="badge bg-info text-dark me-2">
                    {t}
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

            {/* User ID */}
            <div className="mb-3">
              <label className="form-label fw-semibold">User ID</label>
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value.toLowerCase())}
                className="form-control"
              />
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Upload File</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="form-control"
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="btn btn-primary w-100 py-2 fw-bold"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}