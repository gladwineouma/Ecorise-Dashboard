import React, { useState, useMemo, useEffect } from 'react';
import { useFeedback } from '../hooks/useFetchFeedback';
import './style.css';

const columns = [
  { label: 'Feedback ID', key: 'feedback_id' },
  { label: 'User Type', key: 'user_type' },
  { label: 'Created At', key: 'created_at' },
  { label: 'Feedback', key: 'feedback' },
  { label: 'User', key: 'user' },
];

function MaterialPaginationBar({ currentPage, setCurrentPage, totalPages, isAll }) {
  return (
    <div className="material-pagination-bar" style={{ display: "flex", alignItems: "center", gap: "12px", padding: 0, background: "none", borderTop: "none", marginTop: "15px" }}>
      {!isAll && (
        <>
          <button
            className="material-pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            type="button"
          >
            Prev
          </button>

          <span style={{ fontSize: "15px", fontWeight: 400, color: "#000", margin: "0 4px" }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="material-pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages <= 1}
            type="button"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

function Feedback() {
  const { feedback, loading, error } = useFeedback();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const totalPages = Math.max(1, Math.ceil(feedback.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedFeedback = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return feedback.slice(start, end);
  }, [feedback, currentPage, rowsPerPage]);

  if (loading) return <div className="feedback-loading">Loading feedback...</div>;
  if (error) return <div className="feedback-error">Error: {error}</div>;
  if (!feedback.length) return <div className="feedback-empty">No feedback available.</div>;

  return (
    <div className="pickup-table-container">
      <div className="feedback-table-container">

        {/* 🌟 STACKED HEADER BAR: Forces pagination row directly below heading label text */}
        <div className="feedback-header-bar" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h1 className="feedback-title">Feedback</h1>

          <MaterialPaginationBar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            isAll={false}
          />
        </div>

        {/* DATA CONTAINER GRID */}
        <div className="feedback-section">
          <div className="feedback-label-row">
            {columns.map(({ label, key }) => (
              <div key={key} className="label-cell">
                {label}
              </div>
            ))}
          </div>

          <div className="feedback-values-rows">
            {pagedFeedback.map((feedbackItem) => (
              <div key={feedbackItem.feedback_id} className="values-row">
                {columns.map(({ key }) => (
                  <div key={`${feedbackItem.feedback_id}-${key}`} className="value-cell">
                    {key === 'created_at'
                      ? new Date(feedbackItem[key]).toLocaleDateString()
                      : feedbackItem[key]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Feedback;
