const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mangaCollectionSchema = new Schema({
    mangaId: {
        type: String,
        required: true
      },
      volumes: {
        type: [String], // Array de strings representando IDs dos volumes
        default: []
      }
});

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // _id será o firebaseId
    mangasCollections: [mangaCollectionSchema] // Array de mangas com seus volumes associados
});

module.exports = mongoose.model('User', userSchema);
