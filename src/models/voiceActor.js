const mongoose = require('mongoose');

const voiceActorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photoUrl: { type: String },
    birthday: { type: String },
    nationality: { type: String },
    favorites: [String],
    biography: { type: String },
    dubCharacters: [{ type: String }]
});

module.exports = mongoose.model("VoiceActor", voiceActorSchema);