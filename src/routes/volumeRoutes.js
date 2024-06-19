const express = require('express');
const router = express.Router();
const volumeController = require('../controllers/volumeController');

// Rota para criar um novo volume
router.post('/', volumeController.createVolume);

// Rota para obter todos os volumes
router.get('/', volumeController.getAllVolumes);

// Rota para obter um volume por ID
router.get('/:id', volumeController.getVolumeById);

// Rota para atualizar um volume por ID
router.put('/:id', volumeController.updateVolume);

// Rota para deletar um volume por ID
router.delete('/:id', volumeController.deleteVolume);

module.exports = router;
