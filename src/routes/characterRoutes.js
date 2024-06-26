const express = require("express");
const {
    createCharacter,
    getAllCharacters,
    getCharacterById,
    updateCharacter,
    deleteCharacter
} = require("../controllers/characterController");

const router = express.Router();

router.post("/", createCharacter);
router.get("/", getAllCharacters);
router.get("/:id", getCharacterById);
router.patch("/:id", updateCharacter);
router.delete("/:id", deleteCharacter);

module.exports = router;
