// src/components/FileSearch.jsx
import { useState } from "react";
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
  const [userId, setUserId] = useState("nitin");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log("token from local storage", token);

  // Dynamic minor options
  const minorOptions =
    major === "Personal"
      ? ["John", "Tom", "Emily", "Simun"]
      : major === "Company"
      ? ["Google", "Microsoft", "Apple", "Amazon"]
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
    return tags.length > 0 ? tags.map((t) => ({ tag_name: t })) : [{ tag_name: "" }];
  };

  // Search handler
  const handleSearch = async () => {
    setLoading(true);
    setCurrentPage(1); // reset pagination on new search

    const body = {
      major_head: major || "",
      minor_head: minor || "",
      from_date: fromDate || "",
      to_date: toDate || "",
      tags: getTagsForRequest() || [{ tag_name: "" }, { tag_name: "" }],
      uploaded_by: "",
      start: 0,
      length: 1000, // fetch all for frontend pagination
      filterId: "",
      search: { value: "" },
    };

    console.log("Search payload:", JSON.stringify(body, null, 2));

    try {
      const res = await searchDocument(token, body);
      console.log("Full Response:", res.data.data);

      const docs = res.data?.data || [];
      setResults(docs);
    } catch (error) {
      console.error("Search failed:", error.response || error);
      alert("❌ Failed to fetch documents!");
    } finally {
      setLoading(false);
    }
  };

  // Simulate download
  const handleDownload = (file) => {
    const fileUrl = file.file_url;
    if (!fileUrl) return alert("File URL not available");

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.major_head || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    alert("Simulated download of all results as ZIP!");
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-lg border-0 rounded-4">
            <div
              className="card-header bg-primary text-white text-center py-3"
              style={{ backgroundColor: "#B7C1E4", color: "#202B51" }}
            >
              <h4 className="mb-0">Search Documents</h4>
            </div>
            <div className="card-body p-4">
              {/* Filters */}
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={major}
                    onChange={(e) => {
                      setMajor(e.target.value);
                      setMinor("");
                    }}
                  >
                    <option>Personal</option>
                    <option>Professional</option>
                    <option>Company</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    {major === "Personal"
                      ? "Name"
                      : major === "Company"
                      ? "Company Name"
                      : "Department"}
                  </label>
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

                <div className="col-md-3">
                  <label className="form-label fw-semibold">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>

              {/* User ID */}
              <div className="mb-3 mt-3">
                <label className="form-label fw-semibold" htmlFor="userId">
                  Name
                </label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="form-control"
                  placeholder="Enter user ID"
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
                  <button type="button" className="btn btn-secondary" onClick={addTag}>
                    Add
                  </button>
                </div>
                <div>
                  {tags.map((t) => (
                    <span key={t} className="badge bg-info me-2">
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

              {/* Search Button */}
              <div className="d-grid mb-4">
                <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Results Table */}
              <div>
                <h5>Results</h5>
                {results.length === 0 ? (
                  <p>No documents found.</p>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-striped align-middle">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Document Name</th>
                            <th>Major</th>
                            <th>Minor</th>
                            <th>Date</th>
                            <th>Remarks</th>
                            <th>Tags</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentResults.map((file, index) => (
                            <tr key={index}>
                              <td>{indexOfFirstItem + index + 1}</td>
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
                    </div>

                    {/* Pagination */}
                    {results.length > itemsPerPage && (
                      <nav>
                        <ul className="pagination justify-content-center mt-3">
                          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                              Previous
                            </button>
                          </li>

                          {[...Array(totalPages)].map((_, idx) => (
                            <li
                              key={idx}
                              className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(idx + 1)}
                              >
                                {idx + 1}
                              </button>
                            </li>
                          ))}

                          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}

                    <div className="mt-3">
                      <button className="btn btn-outline-primary" onClick={handleDownloadAll}>
                        Download All as ZIP
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Preview Modal */}
              {previewFile && (
                <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSearch;
