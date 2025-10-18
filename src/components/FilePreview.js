import React, { useState, useEffect } from "react";

const FilePreview = ({ file, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">File Preview</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body text-center">
            {loading ? (
              <p>Loading...</p>
            ) : file.type === "image" ? (
              <img
                src={file.url}
                alt="Preview"
                className="img-fluid rounded"
                style={{ maxHeight: "500px" }}
              />
            ) : (
              <p>No preview available for this file type</p>
            )}

            <p className="mt-3 text-muted">
              {file.document_remarks || "No document found"}
            </p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
