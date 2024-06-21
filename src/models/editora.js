const mongoose = require('mongoose');

const editoraSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sinceYear: {
        type: Number,
        required: true
    },
});

const Editora = mongoose.model('Editora', editoraSchema);

module.exports = Editora;
