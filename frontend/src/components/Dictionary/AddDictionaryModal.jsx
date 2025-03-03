import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { createDictionary } from "../../features/dictionary/dictionarySlice";

const AddDictionaryModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [fallbackLang, setFallbackLang] = useState("");
  const [translateLang, setTranslateLang] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the createDictionary action
    dispatch(createDictionary({ name, fallbackLang, translateLang }));

    // Reset fields and close the modal
    setName("");
    setFallbackLang("");
    setTranslateLang("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Dictionary</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Dictionary Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Fallback Language"
            value={fallbackLang}
            onChange={(e) => setFallbackLang(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Translation Language"
            value={translateLang}
            onChange={(e) => setTranslateLang(e.target.value)}
            required
          />
          <button type="submit">Add Dictionary</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
AddDictionaryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddDictionaryModal;
