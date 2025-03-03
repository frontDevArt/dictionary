import PropTypes from "prop-types";
import { useState } from "react";

const EditRowModal = ({ isOpen, onClose, row, onSubmit }) => {
  const [fallbackText, setFallbackText] = useState(row.fallbackText);
  const [translateText, setTranslateText] = useState(row.translateText);
  const [order, setOrder] = useState(row.order);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...row, fallbackText, translateText, order });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Row</h2>
        <form onSubmit={handleSubmit}>
          <label>Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value))}
            required
          />
          <label>Fallback Text</label>
          <input
            type="text"
            value={fallbackText}
            onChange={(e) => setFallbackText(e.target.value)}
            required
          />
          <label>Translated Text</label>
          <input
            type="text"
            value={translateText}
            onChange={(e) => setTranslateText(e.target.value)}
            required
          />
          <button type="submit">Save Changes</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

EditRowModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  row: PropTypes.shape({
    fallbackText: PropTypes.string,
    translateText: PropTypes.string,
    order: PropTypes.number,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditRowModal;
