const mongoose = require('mongoose');

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
});

const Genres = mongoose.model('Genres', genresSchema);

module.exports = Genres;
