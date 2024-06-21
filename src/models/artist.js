const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photoUrl: { type: String },
  birthday: { type: String },
  nationality: { type: String },
  favorites: [String],
  mangasRelationship: [
    {
      mangaId: { type: mongoose.Schema.Types.ObjectId, ref: "Manga" },
    },
  ],
  biography: { type: String },
  dubCharacters: [
    {
      mangaId: { type: mongoose.Schema.Types.ObjectId, ref: "Manga" },
      charactersId: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Character" },
      ],
    },
  ],
  role: { type: String, enum: ["author", "voiceActor"] },
});

module.exports = mongoose.model("Artist", artistSchema);
