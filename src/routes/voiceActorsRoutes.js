const express = require('express');
const router = express.Router();
const voiceActorController = require('../controllers/voiceActorController');

// Rota para adicionar um dublador
router.post('/', voiceActorController.addVoiceActor);

// Rota para obter todos os dubladores
router.get('/', voiceActorController.getAllVoiceActors);

// Rota para obter um dublador por ID
router.get('/:id', voiceActorController.getVoiceActorById);

// Rota para atualizar um dublador
router.put('/:id', voiceActorController.updateVoiceActor);

// Rota para deletar um dublador
router.delete('/:id', voiceActorController.deleteVoiceActor);

module.exports = router;