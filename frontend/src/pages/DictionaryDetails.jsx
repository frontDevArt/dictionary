import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddBulkRowsModal from "../components/Dictionary/AddBulkRowsModal";
import AddSingleRowModal from "../components/Dictionary/AddSingleRowModal";
import EditRowModal from "../components/Dictionary/EditRowModal";
import {
  fetchSingleDictionary,
  selectDictionaryById,
  updateDictionary,
} from "../features/dictionary/dictionarySlice";
import "./DictionaryDetails.scss";

const DictionaryDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const dictionary = useSelector((state) => selectDictionaryById(state, id));
  const { error } = useSelector((state) => state.dictionary);

  const [isSingleRowModalOpen, setIsSingleRowModalOpen] = useState(false);
  const [isBulkRowsModalOpen, setIsBulkRowsModalOpen] = useState(false);
  const [isEditRowModalOpen, setIsEditRowModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!dictionary) {
      dispatch(fetchSingleDictionary(id));
    } else {
      setRows(dictionary.rows);
    }
  }, [id, dispatch, dictionary]);

  const handleEditRow = (row) => {
    setSelectedRow(row);
    setIsEditRowModalOpen(true);
  };

  const handleSaveRowChanges = (updatedRow) => {
    const updatedRows = rows.map((row) =>
      row.order === updatedRow.order
        ? { ...row, order: selectedRow.order }
        : row
    );

    const finalRows = updatedRows.map((row) =>
      row.order === selectedRow.order ? updatedRow : row
    );

    dispatch(updateDictionary({ id, data: { rows: finalRows } }));
    setIsEditRowModalOpen(false);
    setSelectedRow(null);
  };

  const handleAddSingleRow = (newRow) => {
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    dispatch(updateDictionary({ id, data: { rows: updatedRows } }));
    setIsSingleRowModalOpen(false);
  };

  const handleAddBulkRows = (newRows) => {
    const updatedRows = [...rows, ...newRows];
    setRows(updatedRows);
    dispatch(updateDictionary({ id, data: { rows: updatedRows } }));
    setIsBulkRowsModalOpen(false);
  };

  const handleDeleteRow = (rowId) => {
    if (!window.confirm("Are you sure you want to delete this row?")) return;

    const updatedRows = rows.filter((row) => row._id !== rowId);
    setRows(updatedRows);
    dispatch(
      updateDictionary({
        id,
        data: { rows: updatedRows },
        deleteRowIds: [rowId],
      })
    );
  };

  // 🔥 Handle Drag & Drop event
  const handleDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside, do nothing

    const reorderedRows = [...rows];
    const [movedRow] = reorderedRows.splice(result.source.index, 1);
    reorderedRows.splice(result.destination.index, 0, movedRow);

    // Recalculate order numbers to remove gaps
    const updatedRows = reorderedRows.map((row, index) => ({
      ...row,
      order: index + 1,
    }));

    setRows(updatedRows);
    dispatch(updateDictionary({ id, data: { rows: updatedRows } }));
  };

  if (error) return <p>Error: {error}</p>;
  if (!dictionary) return <p>Dictionary not found.</p>;

  return (
    <div>
      <h2>Dictionary: {dictionary.name}</h2>
      <p>
        <strong>Fallback Language:</strong> {dictionary.fallbackLang}
      </p>
      <p>
        <strong>Translation Language:</strong> {dictionary.translateLang}
      </p>

      <h3>Rows</h3>
      <button onClick={() => setIsSingleRowModalOpen(true)}>
        Add Single Row
      </button>
      <button onClick={() => setIsBulkRowsModalOpen(true)}>
        Add Bulk Rows
      </button>

      {rows.length === 0 ? (
        <p>No rows available.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="rows">
            {(provided) => (
              <table {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Fallback Text</th>
                    <th>Translated Text</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <Draggable
                      key={row._id}
                      draggableId={row._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? "dragging-row" : ""}
                        >
                          <td>{row.order}</td>
                          <td>{row.fallbackText}</td>
                          <td>{row.translateText}</td>
                          <td>
                            <button onClick={() => handleEditRow(row)}>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteRow(row._id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Modals */}
      <AddSingleRowModal
        isOpen={isSingleRowModalOpen}
        onClose={() => setIsSingleRowModalOpen(false)}
        onSubmit={handleAddSingleRow}
        currentRowCount={rows.length}
      />
      <AddBulkRowsModal
        isOpen={isBulkRowsModalOpen}
        onClose={() => setIsBulkRowsModalOpen(false)}
        onSubmit={handleAddBulkRows}
        currentRowCount={rows.length}
      />
      {selectedRow && (
        <EditRowModal
          isOpen={isEditRowModalOpen}
          onClose={() => {
            setIsEditRowModalOpen(false);
            setSelectedRow(null);
          }}
          row={selectedRow}
          onSubmit={handleSaveRowChanges}
        />
      )}
    </div>
  );
};

export default DictionaryDetails;
