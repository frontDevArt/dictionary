import PropTypes from "prop-types";
import { useState } from "react";

const AddBulkRowsModal = ({ isOpen, onClose, onSubmit, currentRowCount }) => {
  const [bulkInput, setBulkInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const rows = bulkInput.split("\n").map((line, index) => {
      const [fallbackText, translateText] = line.split(" — ");
      return {
        order: currentRowCount + index + 1,
        fallbackText: fallbackText.trim(),
        translateText: translateText.trim(),
      };
    });
    onSubmit(rows);
    onClose();
    setBulkInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Bulk Rows</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Fallback Text — Translated Text"
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            rows="8"
            required
          ></textarea>
          <button type="submit">Add Rows</button>
        </form>
        <button
          onClick={() => {
            onClose();
            setBulkInput("");
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

AddBulkRowsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  currentRowCount: PropTypes.number.isRequired,
};

export default AddBulkRowsModal;
