// src/components/FileSearch.jsx
import React, { useState } from "react";
import { searchDocument } from "../api/api";
import FilePreviewModal from "./FilePreviewModal";

const FileSearch = ({ token }) => {
  const [major, setMajor] = useState("Personal");
  const [minor, setMinor] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("simun");


  // Dynamic minor options
  const minorOptions =
    major === "Personal"
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

  // Prepare tags for API request
  const getTagsForRequest = () => {
    return tags.length > 0 ? tags.map((t) => ({ tag_name: t})) : [{ tag_name: "" }];
  };

  // Search handler
  const handleSearch = async () => {
    setLoading(true);

    const body = {
      major_head: major || "",
      minor_head: minor || "",
      doucument_date : "17-10-2025",
      from_date: fromDate || "",
      to_date: toDate || "",
      tags: getTagsForRequest(),
      uploaded_by: "",
      start: 0,
      length: 10,
      filterId: "",
      search: { value: "" },
      user_id: userId || "simun",
    };

    console.log("Search payload:", JSON.stringify(body, null, 2));

    try {
      const res = await searchDocument(token, body);
      // await searchDocument(token, body);
      console.log("Search Response:", res.data);
      setResults(res.data.data || []); // adjust if backend uses another key
    } catch (error) {
      console.error("Search failed:", error.response || error);
      alert("❌ Failed to fetch documents!");
    }

    setLoading(false);
  };

  // Simulate download
  const handleDownload = (file) => {
    const fileUrl = file.file_url; // URL of the file
    if (!fileUrl) return alert("File URL not available");
  
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;
  
    // Extract filename from URL or fallback to "download"
    const fileName = file.major_head|| "download";
    link.download = fileName;
  
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const handleDownloadAll = () => {
    alert("Simulated download of all results as ZIP!");
  };

  return (
    <div className="container mt-4">
      <h4>Search Documents</h4>

      {/* Filters */}
      <div className="row mt-3">
        <div className="col-md-3 mb-2">
          <label>Category</label>
          <select
            className="form-select"
            value={major}
            onChange={(e) => {
              setMajor(e.target.value);
              setMinor(""); // reset minor on major change
            }}
          >
            <option>Personal</option>
            <option>Professional</option>
          </select>
        </div>

        <div className="col-md-3 mb-2">
          <label>{major === "Personal" ? "Name" : "Department"}</label>
          <select
            className="form-select"
            value={minor}
            onChange={(e) => setMinor(e.target.value)}
          >
            <option value="">Select...</option>
            {minorOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 mb-2">
          <label>From Date</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-2">
          <label>To Date</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="userId">Name</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="form-control mb-3"
          placeholder="Enter user ID"
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

      {/* Search button */}
      <button
        className="btn btn-primary mt-3"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {/* Results table */}
      <div className="mt-5">
        <h5>Results</h5>
        {results.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <>
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Name</th>
                  <th>Major</th>
                  <th>Minor</th>
                  <th>Date</th>
                  <th>Tags</th>
                  <th>Document Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((file, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{file.document_name || "Untitled"}</td>
                    <td>{file.major_head}</td>
                    <td>{file.minor_head}</td>
                    <td>{file.document_date}</td>
                    <td>{file.document_remarks}</td>
                    <td>
                      {file.tags?.map((t, i) => (
                        <span key={i} className="badge bg-secondary me-1">
                          {t.tag_name}
                        </span>
                      ))}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => setPreviewFile(file)}
                      >
                        Preview
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleDownload(file)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="btn btn-outline-primary"
              onClick={handleDownloadAll}
            >
              Download All as ZIP
            </button>
          </>
        )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default FileSearch;
