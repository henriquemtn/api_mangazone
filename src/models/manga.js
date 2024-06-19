const mongoose = require('mongoose');

// Subesquema para Characters
const charactersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photoUrl: { type: String },
    spoiler: { type: String },
    age: { type: Number },
    biography: { type: String },
    voiceActors: [{type: String}],
});

// Subesquema para Volumes
const volumeSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    date: { type: String },
    alternativeCover: { type: Boolean, default: false },
    chapters: { type: String },
    image: { type: String },
    linkAmazon: { type: String },
    price: { type: Number }
});

// Esquema para Manga
const mangaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    releaseDate: { type: String, required: true },
    status: { type: String },
    alternativeTitles: [String],
    genres: [String],
    imageUrl: { type: String, required: true },
    publisherBy: { type: String, required: true },
    synopsis: { type: String, required: true },
    score: { type: Number, min: 0, max: 10 },
    characters: [charactersSchema],
    volumes: [volumeSchema],
    reviews: [{ type: String }]
}, { timestamps: true });

const Manga = mongoose.model('Manga', mangaSchema);

module.exports = Manga;
