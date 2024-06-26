const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photoUrl: { type: String },
    spoiler: { type: String },
    age: { type: Number },
    biography: { type: String },
    mangaRef: { type: String },
    voiceActors: [{type: String}],
    
});

module.exports = mongoose.model("Character", characterSchema);
