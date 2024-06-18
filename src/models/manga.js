const mongoose = require('mongoose');

const volumeSchema = new mongoose.Schema({
    volumeNumber: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    chapters: { type: [String], required: true },
    imageUrl: { type: String },
    volumeName: { type: String, required: true } ,
    price: {type: Number, required: false},
    link: {type: String, required: false}
});

// Antes de salvar, vamos concatenar o título do mangá com o número do volume
volumeSchema.pre('save', function(next) {
    if (!this.isNew) {
        return next();
    }

    const mangaTitle = this.parent().title; // Obtém o título do mangá
    const volumeNumber = this.volumeNumber; // Obtém o número do volume

    this.volumeName = `${mangaTitle} ${volumeNumber}`; // Concatena o título do mangá com o número do volume
    next();
});

const mangaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    volumes: [volumeSchema], 
    imageUrl: { type: String } 
});

const Manga = mongoose.model('Manga', mangaSchema);

module.exports = Manga;
