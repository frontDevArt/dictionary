import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDictionaries,
  deleteDictionary,
} from "../../features/dictionary/dictionarySlice";
import AddDictionaryModal from "./AddDictionaryModal";
import EditMetadataModal from "./EditMetadataModal";
import "./Dictionary.scss";

const DictionaryTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { dictionaries, loading, error } = useSelector(
    (state) => state.dictionary
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDictionary, setSelectedDictionary] = useState(null);

  React.useEffect(() => {
    dispatch(fetchDictionaries());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this dictionary?")) {
      dispatch(deleteDictionary(id));
    }
  };

  const handleOpenEditModal = (dictionary) => {
    setSelectedDictionary(dictionary);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedDictionary(null);
    setIsEditModalOpen(false);
  };

  const handleOpenDictionary = (id) => {
    navigate(`/dictionary/${id}`); // Navigate to the dictionary details page
  };

  if (loading) return <p>Loading dictionaries...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Your Dictionaries</h2>
      <button onClick={() => setIsAddModalOpen(true)}>Add Dictionary</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Fallback Language</th>
            <th>Translation Language</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dictionaries.map((dictionary) => (
            <tr key={dictionary._id}>
              <td>{dictionary.name}</td>
              <td>{dictionary.fallbackLang}</td>
              <td>{dictionary.translateLang}</td>
              <td>
                <button onClick={() => handleOpenEditModal(dictionary)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(dictionary._id)}>
                  Delete
                </button>
                <button onClick={() => handleOpenDictionary(dictionary._id)}>
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddDictionaryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      {selectedDictionary && (
        <EditMetadataModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          dictionary={selectedDictionary}
        />
      )}
    </div>
  );
};

export default DictionaryTable;
