import React, { useState } from "react";

const FilePreview = ({ file }) => {
  const [showPreview, setShowPreview] = useState(false);
  console.log("File Preview", file)

  return (
    <div>
      <p>{file.document_remarks}</p>
      <button onClick={() => setShowPreview(!showPreview)}>
        {showPreview ? "Hide Preview" : "Preview File"}
      </button>

      {showPreview && (
        <>
          {file.file_url.endsWith(".png") ||
          file.file_url.endsWith(".jpg") ||
          file.file_url.endsWith(".jpeg") ? (
            <img
              src={file.file_url}
              alt="Preview"
              style={{ width: "300px", marginTop: "10px" }}
            />
          ) : file.file_url.endsWith(".pdf") ? (
            <iframe
              src={file.file_url}
              width="100%"
              height="500px"
              title="PDF Preview"
            />
          ) : (
            <p>
              Preview not available. <a href={file.file_url} target="_blank">Open File</a>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default FilePreview;
