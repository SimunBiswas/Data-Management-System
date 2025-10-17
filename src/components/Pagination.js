// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const createPageNumbers = () => {
    const pages = [];

    // Always show first page
    if (currentPage > 2) {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
    }

    // Show current, previous, and next
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Show ellipsis and last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = createPageNumbers();

  return (
    <nav>
      <ul className="pagination justify-content-center mt-3">
        {/* Previous Button */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((page, index) =>
          page === "..." ? (
            <li key={index} className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          ) : (
            <li
              key={index}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          )
        )}

        {/* Next Button */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
