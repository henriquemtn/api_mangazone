const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  displayName: { type: String },
  biography: { type: String },
  gender: { type: String},
  photoURL: { type: String },
  location: { type: String },
  role: { type: String, default: 'user' }, 
  favorites: [{ type: String },], 
  characters: [{ type: String },],
  mangaCollection: [{
    mangaId: { type: Schema.Types.ObjectId, ref: 'Manga' },
    volumes: [{ type: Schema.Types.ObjectId, ref: 'Volume' }] 
  }],
  people: [{ type: String },], 
  comments: [{ type: String },],
  friends: [{ type: String },],
  wishlist: [{ type: String },] 
});

module.exports = mongoose.model("User", UserSchema);
