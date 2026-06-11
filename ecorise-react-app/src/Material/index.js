
import useFetchMaterial from "../hooks/useFetchMaterialsInfo";
import "./index.css";
import React, { useState, useEffect } from "react";


const ROW_OPTIONS = [5, 10, 15, "All"];

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">×</button>
        {children}
      </div>
    </div>
  );
}

function AddMaterialModal({ open, onClose, onAdd }) {
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type.trim() || price === "" || isNaN(Number(price))) return;
    setSubmitting(true);
    await onAdd({ material_type: type.trim(), price_per_kg: Number(price) });
    setType("");
    setPrice("");
    setSubmitting(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 style={{
        margin: 0, fontSize: 24, fontWeight: 700, color: "#7d1215", textAlign: "left", marginBottom: 16, fontFamily: "'Poppins', sans-serif"
      }}>
        Add New Material
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 280 }}>
        <input
          type="text"
          placeholder="Material Type"
          value={type}
          onChange={e => setType(e.target.value)}
          style={{
            padding: 10, borderRadius: 6, border: "1.5px solid #b7101d", fontSize: 16, fontFamily: "'Poppins', sans-serif"
          }}
          required
        />
        <input
          type="number"
          placeholder="Price per Kg"
          value={price}
          onChange={e => setPrice(e.target.value)}
          min={0}
          step={0.01}
          style={{
            padding: 10, borderRadius: 6, border: "1.5px solid #b7101d", fontSize: 16, fontFamily: "'Poppins', sans-serif"
          }}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            background: "#7d1215", color: "#fff", border: "none", borderRadius: 6, padding: "12px 0", fontWeight: 700, fontSize: 16, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "'Poppins', sans-serif"
          }}
        >
          Add
        </button>
      </form>
    </Modal>
  );
}

// 🌟 Paste this function directly into your MaterialPricing index.js file
function MaterialPaginationBar({
  currentPage,
  setCurrentPage,
  totalPages,
  isAll
}) {
  return (
    <div className="material-pagination-bar" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 40px" }}>
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

function MaterialPricing() {
  const { materials, loading, error, editMaterial, removeMaterial, addMaterial } = useFetchMaterial();

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ material_type: "", price_per_kg: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(ROW_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const startEdit = (mat) => {
    setEditingId(mat.material_id);
    setEditValues({ material_type: mat.material_type, price_per_kg: mat.price_per_kg });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ material_type: "", price_per_kg: "" });
  };

  const saveEdit = async (id) => {
    if (!editValues.material_type.trim() || editValues.price_per_kg === "" || isNaN(Number(editValues.price_per_kg))) return;
    try {
      await editMaterial(id, {
        material_type: editValues.material_type.trim(),
        price_per_kg: Number(editValues.price_per_kg),
      });
      cancelEdit();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await removeMaterial(id);
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };


  const handleAddMaterial = async ({ material_type, price_per_kg }) => {
    if (!material_type.trim() || price_per_kg === "" || isNaN(Number(price_per_kg))) return;
    try {
      setIsAdding(true);
      await addMaterial({ material_type: material_type.trim(), price_per_kg: Number(price_per_kg) });
      setIsAdding(false);
      setShowAddModal(false);
    } catch (err) {
      setIsAdding(false);
      alert("Failed to add material: " + err.message);
    }
  };


  const filteredMaterials = materials.filter(mat => {
    const lowerTerm = searchTerm.toLowerCase();
    const createdAtStr = mat.created_at ? new Date(mat.created_at).toLocaleString() : "";
    return (
      mat.material_type.toLowerCase().includes(lowerTerm) ||
      mat.price_per_kg.toString().toLowerCase().includes(lowerTerm) ||
      createdAtStr.toLowerCase().includes(lowerTerm) ||
      (mat.material_id?.toString().toLowerCase().includes(lowerTerm) ?? false)
    );
  });


  const sortedMaterials = [...filteredMaterials].sort((a, b) => Number(b.material_id) - Number(a.material_id));

  const totalRows = sortedMaterials.length;
  const pageSize = rowsPerPage === "All" ? totalRows || 1 : rowsPerPage;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const isAll = rowsPerPage === "All";
  const paginatedMaterials = isAll ? sortedMaterials : sortedMaterials.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [rowsPerPage, totalRows, totalPages, currentPage]);

  return (
    <div className="pickup-main-container">
      <div className="pickup-table-container">
        <div className="pickup-request-bar">
          <p>Material Pricing</p>
        </div>
        <section className="pickup-section">
          {error && <div className="error">Error: {error}</div>}
          <MaterialPaginationBar
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            isAll={isAll}
          />
          <table className="pickup-table" aria-label="Material Pricing Table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Material Type</th>
                <th>Price per Kg (Kshs)</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(loading || isAdding) ? (
                <tr>
                  <td colSpan={5} className="loading-cell">Loading materials...</td>
                </tr>
              ) : paginatedMaterials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="no-data-cell">
                    No materials found.
                  </td>
                </tr>
              ) : (
                paginatedMaterials.map((mat, idx) => {
                  const isEditing = editingId === mat.material_id;
                  return (
                    <tr key={mat.material_id} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
                      <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.material_type}
                            onChange={e => setEditValues(prev => ({ ...prev, material_type: e.target.value }))}
                            aria-label="Edit Material Type"
                            className="edit-input"
                          />
                        ) : (
                          mat.material_type
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValues.price_per_kg}
                            onChange={e => setEditValues(prev => ({ ...prev, price_per_kg: e.target.value }))}
                            step="0.01"
                            min="0"
                            aria-label="Edit Price per Kg"
                            className="edit-input"
                          />
                        ) : (
                          `${mat.price_per_kg}`
                        )}
                      </td>
                      <td>{mat.created_at ? new Date(mat.created_at).toLocaleString() : "N/A"}</td>
                      <td>
                        {isEditing ? (
                          <>
                            <button className="material-btn" onClick={() => saveEdit(mat.material_id)}>Save</button>
                            <button className="material-btn cancel-btn" onClick={cancelEdit}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="edit-btn" onClick={() => startEdit(mat)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(mat.material_id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="add-material-btn-wrapper">
            <button className="add-material-btn" onClick={() => setShowAddModal(true)}>
              + Add New Material
            </button>
          </div>
          <AddMaterialModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddMaterial} />
        </section>
      </div>
    </div>
  );
}

export default MaterialPricing;