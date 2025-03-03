const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createDictionary,
  getDictionaries,
  deleteDictionary,
  updateDictionary,
  getDictionaryById,
} = require("../controllers/dictionaryController");
const router = express.Router();

router.route("/").get(protect, getDictionaries).post(protect, createDictionary);
router
  .route("/:id")
  .get(protect, getDictionaryById)
  .put(protect, updateDictionary)
  .delete(protect, deleteDictionary);

module.exports = router;
