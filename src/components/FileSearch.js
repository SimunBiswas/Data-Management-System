import { useState, useEffect } from "react";
import { searchDocument } from "../api/api";
import FilePreview from "./FilePreview";


const FileSearch = ({ token }) => {
  const [major, setMajor] = useState("Personal");
  const [minor, setMinor] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dynamic minor options
  const minorOptions =
    major === "Personal"
      ? ["John", "Tom", "Emily", "Simun"]
      : major === "Company"
      ? ["Google", "Microsoft", "Apple", "Amazon"]
      : ["Accounts", "HR", "IT", "Finance"];

  // Add tag
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (t) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  const getTagsForRequest = () =>
    tags.length > 0 ? tags.map((t) => ({ tag_name: t })) : [{ tag_name: "" }];

  // Search handler (fetch from API)
  const handleSearch = async () => {
    setLoading(true);
    setCurrentPage(1);

    const body = {
      major_head: major || "",
      minor_head: minor || "",
      from_date: fromDate || "",
      to_date: toDate || "",
      tags: getTagsForRequest(),
      start: 0,
      length: 1000,
      filterId: "",
      search: { value: "" },
    };

    try {
      const res = await searchDocument(token, body);
      const docs = res.data?.data || [];

      // Client-side filtering based on selected filters
      const filteredDocs = docs.filter((doc) => {
        if (major && doc.major_head !== major) return false;
        if (minor && doc.minor_head !== minor) return false;
        // if (userId && !doc.uploaded_by.toLowerCase().includes(userId.toLowerCase()))
        //   return false;
        if (tags.length > 0) {
          const docTags = doc.tags?.map((t) => t.tag_name) || [];
          if (!tags.every((t) => docTags.includes(t))) return false;
        }
      
        // Date filtering
        if (fromDate) {
          const docDate = new Date(doc.document_date).setHours(0,0,0,0);
          const from = new Date(fromDate).setHours(0,0,0,0);
          if (docDate < from) return false;
        }
        if (toDate) {
          const docDate = new Date(doc.document_date).setHours(0,0,0,0);
          const to = new Date(toDate).setHours(0,0,0,0);
          if (docDate > to) return false;
        }
      
        return true;
      });
      

      setResults(filteredDocs);
      setFilteredResults(filteredDocs);
      console.log("Filtered Docs :", filteredDocs)
    } catch (error) {
      console.error("Search failed:", error.response || error);
      alert("❌ Failed to fetch documents!");
    } finally {
      setLoading(false);
    }
  };

  // Live search effect
  useEffect(() => {
    if (!searchQuery) {
      setFilteredResults(results);
      return;
    }
    const query = searchQuery.toLowerCase();

    const liveFiltered = results.filter((doc) => {
      return (
        (doc.document_name?.toLowerCase().includes(query) ||
          doc.major_head?.toLowerCase().includes(query) ||
          doc.minor_head?.toLowerCase().includes(query) ||
          doc.uploaded_by?.toLowerCase().includes(query) ||
          doc.document_remarks?.toLowerCase().includes(query) ||
          (doc.tags?.some((t) => t.tag_name.toLowerCase().includes(query)) ?? false))
      );
    });

    setFilteredResults(liveFiltered);
    setCurrentPage(1); // reset pagination on live search
  }, [searchQuery, results]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

    // Preview handler
  const handlePreview = (file) => {
    if (!file.file_url) return alert("File URL not available");

    const ext = file.file_url.split(".").pop().split("?")[0].toLowerCase();
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
      // Show image preview
      setPreviewFile({ type: "image", url: file.file_url, name: file.major_head });
    } else if (ext === "pdf") {
      // Open PDF in new tab
      window.open(file.file_url, "_blank");
    } else {
      alert("Preview not available for this file type");
    }
  };

  // Download
  const handleDownload = (file) => {
    if (!file.file_url) return alert("File URL not available");

    const urlParts = file.file_url.split("/");
    const fileNameFromUrl = urlParts[urlParts.length - 1].split("?")[0];
    const extension = fileNameFromUrl.split(".").pop();

    const date = new Date(file.document_date)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    const link = document.createElement("a");
    link.href = file.file_url;
    link.download = `${file.major_head}_${date}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const handleDownloadAll = async () => {
    // if (!files || files.length === 0) return alert("No files to download");

    // const zip = new JSZip();

    // // Fetch each file as blob
    // await Promise.all(
    //   files.map(async (file) => {
    //     try {
    //       const response = await fetch(file.file_url);
    //       if (!response.ok) throw new Error("File fetch error");
    //       const blob = await response.blob();

    //       const urlParts = file.file_url.split("/");
    //       const fileNameFromUrl = urlParts[urlParts.length - 1].split("?")[0];
    //       const extension = fileNameFromUrl.split(".").pop();
    //       const date = new Date(file.document_date)
    //         .toLocaleDateString("en-GB")
    //         .replace(/\//g, "-");

    //       zip.file(`${file.major_head}_${date}.${extension}`, blob);
    //     } catch (err) {
    //       console.error("Failed to fetch file:", file.file_url, err);
    //     }
    //   })
    // );

    // zip.generateAsync({ type: "blob" }).then((content) => {
    //   saveAs(content, "all_files.zip");
    // });
    alert("All files downloadedF")
  };

  return (
    <div className="container-fluid vh-auto py-5 "
    style={{ backgroundColor: "#475586" }}
>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-lg border-0 rounded-4">
            <div
              className="card-header text-white text-center py-4"
              style={{ backgroundColor: "#202B51" }}
            >
              <h4 className="mb-0">Search Documents</h4>
            </div>
            <div className="card-body p-4">
              {/* Filters */}
              <div className="row g-3 mb-3">
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


              <div className="row">
                
              {/* Tags */}
              <div className="col-md-12 mb-3">
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
                  <button className="btn btn-secondary" onClick={addTag}>
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
                      />
                    </span>
                  ))}
                </div>
              </div>

              
              </div>
              
              <div className="row">
                {/* Search & Live Search */}
                <div className="col-md-2 d-grid my-4" style={{"height" : "50px"}}>
                  <button className="btn btn-primary rounded-4" onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
                <div className="col-md-6 text-center my-2"><
                  img src="/Search.png" alt="searchImg" style={{"width" : "150px", "height" : "150px"}}/>
                </div>
                <div className=" col-md-4 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search from table..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
              </div>
              

              {/* Results Table */}
              <div>
                <h5>Results</h5>
                {filteredResults.length === 0 ? (
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
                              <td>
                              {file.document_date
                                ? new Date(file.document_date).toLocaleDateString("en-GB").replace(/\//g, "-") // DD/MM/YYYY
                                : "-"}
                              </td>
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
                                  className="btn btn-sm btn-info text-white fw-semibold me-2"
                                  onClick={() => handlePreview(file)}
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

                
                          

                    {filteredResults.length > itemsPerPage && (
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
                              <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>
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
                      <button className="btn btn-outline-primary" 
                      onClick={handleDownloadAll}>
                        Download All as ZIP
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Preview Modal */}
              {previewFile && (
                <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSearch;
