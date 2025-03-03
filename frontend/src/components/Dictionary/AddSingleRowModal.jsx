import PropTypes from "prop-types";
import { useState } from "react";

const AddSingleRowModal = ({ isOpen, onClose, onSubmit, currentRowCount }) => {
  const [fallbackText, setFallbackText] = useState("");
  const [translateText, setTranslateText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRow = {
      order: currentRowCount + 1,
      fallbackText,
      translateText,
    };
    onSubmit(newRow);
    onClose();
    setFallbackText("");
    setTranslateText("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Single Row</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Fallback Text"
            value={fallbackText}
            onChange={(e) => setFallbackText(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Translated Text"
            value={translateText}
            onChange={(e) => setTranslateText(e.target.value)}
            required
          />
          <button type="submit">Add Row</button>
        </form>
        <button
          onClick={() => {
            onClose();
            setFallbackText("");
            setTranslateText("");
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

AddSingleRowModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  currentRowCount: PropTypes.number.isRequired,
};

export default AddSingleRowModal;
