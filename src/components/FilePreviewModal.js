// src/components/FilePreviewModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null;

  // Determine file type from document_name extension
  const fileName = file.document_name || "";
  const fileType = fileName.split(".").pop().toLowerCase();

  const renderPreview = () => {
    if (fileType === "pdf") {
      return (
        <iframe
          src={file.document_url || "#"}
          title={fileName}
          style={{ width: "100%", height: "500px" }}
        />
      );
    } else if (["png", "jpg", "jpeg", "gif"].includes(fileType)) {
      return (
        <img
          src={file.document_url || "#"}
          alt={fileName}
          className="img-fluid"
        />
      );
    } else {
      return <p>Preview not available for this file type.</p>;
    }
  };

  return (
    <Modal show={true} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Preview: {fileName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{renderPreview()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="success"
          onClick={() => alert(`Simulated download: ${fileName}`)}
        >
          Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilePreviewModal;
