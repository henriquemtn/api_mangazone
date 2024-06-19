const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// Rotas para CRUD de personagens
router.get('/:mangaId/characters', characterController.getCharactersByManga);
router.post('/:mangaId/characters', characterController.addCharacter);
router.put('/:mangaId/characters/:characterId', characterController.updateCharacter);
router.delete('/:mangaId/characters/:characterId', characterController.deleteCharacter);

// Rota para adicionar e remover um dublador a um personagem
router.put('/:mangaId/characters/:characterId/addVoiceActor/:voiceActorId', characterController.addVoiceActorToCharacter);
router.delete('/:mangaId/characters/:characterId/removeVoiceActor/:voiceActorId', characterController.removeVoiceActorFromCharacter);

module.exports = router;
