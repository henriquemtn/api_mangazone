const mongoose = require('mongoose');

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
    volumes: [volumeSchema],
    characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
    reviews: [{ type: String }]
}, { timestamps: true });

const Manga = mongoose.model('Manga', mangaSchema);

module.exports = Manga;
