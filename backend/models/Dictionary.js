const mongoose = require("mongoose");

const dictionarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    fallbackLang: { type: String, required: true },
    translateLang: { type: String, required: true },
    rows: [
      {
        fallbackText: { type: String, required: true },
        translateText: { type: String, required: true },
        order: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dictionary", dictionarySchema);
