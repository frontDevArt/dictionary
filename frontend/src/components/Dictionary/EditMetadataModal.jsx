import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { updateDictionary } from "../../features/dictionary/dictionarySlice";

const EditMetadataModal = ({ isOpen, onClose, dictionary }) => {
  const [name, setName] = useState(dictionary.name);
  const [fallbackLang, setFallbackLang] = useState(dictionary.fallbackLang);
  const [translateLang, setTranslateLang] = useState(dictionary.translateLang);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the updateDictionary action
    dispatch(
      updateDictionary({
        id: dictionary._id,
        data: { name, fallbackLang, translateLang },
      })
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Dictionary</h2>
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
          <button type="submit">Save Changes</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
EditMetadataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dictionary: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fallbackLang: PropTypes.string.isRequired,
    translateLang: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditMetadataModal;
