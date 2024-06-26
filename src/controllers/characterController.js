const Character = require("../models/character");

// Create a new character
const createCharacter = async (req, res) => {
    try {
        const character = new Character(req.body);
        await character.save();
        res.status(201).send(character);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all characters or search characters by name or mangaRef
const getAllCharacters = async (req, res) => {
  try {
      const { search } = req.query;
      let query = {};

      if (search) {
          query = {
              $or: [
                  { name: { $regex: new RegExp(search, 'i') } },
                  { mangaRef: { $regex: new RegExp(search, 'i') } }
              ]
          };
      }

      const characters = await Character.find(query);
      res.status(200).send(characters);
  } catch (error) {
      res.status(500).send(error);
  }
};

// Get a character by ID
const getCharacterById = async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(404).send();
        }
        res.status(200).send(character);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a character by ID
const updateCharacter = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'photoUrl', 'spoiler', 'age', 'biography', 'mangaRef', 'voiceActors'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(404).send();
        }

        updates.forEach((update) => character[update] = req.body[update]);
        await character.save();
        res.status(200).send(character);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a character by ID
const deleteCharacter = async (req, res) => {
    try {
        const character = await Character.findByIdAndDelete(req.params.id);
        if (!character) {
            return res.status(404).send();
        }
        res.status(200).send(character);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createCharacter,
    getAllCharacters,
    getCharacterById,
    updateCharacter,
    deleteCharacter
};
