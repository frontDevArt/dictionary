const { default: mongoose } = require("mongoose");
const Dictionary = require("../models/Dictionary");

// Create a new dictionary
const createDictionary = async (req, res) => {
  const { name, fallbackLang, translateLang } = req.body;

  try {
    const dictionary = await Dictionary.create({
      user: req.user.id,
      name,
      fallbackLang,
      translateLang,
      rows: [],
    });

    res.status(201).json(dictionary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all dictionaries for a user
const getDictionaries = async (req, res) => {
  try {
    const dictionaries = await Dictionary.find({ user: req.user.id });

    res.status(200).json(dictionaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a dictionary by ID

const getDictionaryById = async (req, res) => {
  try {
    const dictionary = await Dictionary.findById(req.params.id);

    if (!dictionary) {
      return res.status(404).json({ message: "Dictionary not found" });
    }

    if (dictionary.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedDictionary = {
      ...dictionary,
      rows: dictionary.rows.sort((a, b) => a.order - b.order),
    };

    res.status(200).json(updatedDictionary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDictionary = async (req, res) => {
  const { name, fallbackLang, translateLang, rows, deleteRowIds } = req.body;

  try {
    const dictionary = await Dictionary.findById(req.params.id);

    if (!dictionary) {
      return res.status(404).json({ message: "Dictionary not found" });
    }

    if (dictionary.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update metadata if provided
    if (name) dictionary.name = name;
    if (fallbackLang) dictionary.fallbackLang = fallbackLang;
    if (translateLang) dictionary.translateLang = translateLang;

    if (deleteRowIds && deleteRowIds.length > 0) {
      dictionary.rows = dictionary.rows.filter(
        (row) => !deleteRowIds.includes(row._id.toString())
      );
      dictionary.rows = dictionary.rows
        .sort((a, b) => a.order - b.order)
        .map((row, index) => ({ ...row, order: index + 1 }));
    }

    if (rows) {
      let updatedRows = [...dictionary.rows];

      rows.forEach((updatedRow) => {
        if (!updatedRow._id) {
          // 🔥 This is a NEW row, so we ADD it instead of skipping!
          updatedRows.push({
            _id: new mongoose.Types.ObjectId(), // Generate a new MongoDB ID
            fallbackText: updatedRow.fallbackText,
            translateText: updatedRow.translateText,
            order: updatedRow.order || updatedRows.length + 1, // Default order at the end
          });
        } else {
          // Existing row update
          const rowIndex = updatedRows.findIndex(
            (r) => r._id?.toString() === updatedRow._id?.toString()
          );

          if (rowIndex !== -1) {
            // Find the row that currently has the target order
            const targetIndex = updatedRows.findIndex(
              (r) => r.order === updatedRow.order
            );

            if (targetIndex !== -1 && targetIndex !== rowIndex) {
              // Swap their order
              [updatedRows[rowIndex].order, updatedRows[targetIndex].order] = [
                updatedRows[targetIndex].order,
                updatedRows[rowIndex].order,
              ];
            }

            // Update row values
            updatedRows[rowIndex] = {
              ...updatedRows[rowIndex],
              fallbackText:
                updatedRow.fallbackText || updatedRows[rowIndex].fallbackText,
              translateText:
                updatedRow.translateText || updatedRows[rowIndex].translateText,
            };
          }
        }
      });

      dictionary.rows = updatedRows.sort((a, b) => a.order - b.order);
    }

    await dictionary.save();
    res.status(200).json(dictionary);
  } catch (error) {
    console.error("Update Dictionary Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a dictionary
const deleteDictionary = async (req, res) => {
  try {
    const dictionary = await Dictionary.findById(req.params.id);

    if (!dictionary) {
      return res.status(404).json({ message: "Dictionary not found" });
    }

    if (dictionary.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await dictionary.deleteOne();
    res.status(200).json({ message: "Dictionary removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDictionary,
  getDictionaries,
  getDictionaryById,
  deleteDictionary,
  updateDictionary,
};
