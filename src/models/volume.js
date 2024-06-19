const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VolumeSchema = new Schema({
    number: { type: Number, required: true },
  date: { type: Date, required: true },
  alternativeCover: { type: Boolean, default: false },
  image: { type: String },
  linkAmazon: { type: String },
  price: { type: Number },
  chapters: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Volume', VolumeSchema);