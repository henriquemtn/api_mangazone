const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/mangaController');

// Rota para criar um novo mangá
router.post('/', mangaController.createManga);

// Rota para obter todos os mangás
router.get('/', mangaController.getAllMangas);

// Rota para obter um mangá por ID
router.get('/:id', mangaController.getMangaById);

// Rota para atualizar um mangá por ID
router.put('/:id', mangaController.updateManga);

// Rota para deletar um mangá por ID
router.delete('/:id', mangaController.deleteManga);

// Rota para adicionar um volume a um mangá
router.post('/:mangaId/volumes', mangaController.addVolume);

// Rota para obter os volumes de um mangá
router.get('/:mangaId/volumes', mangaController.listVolumes);

// Rota para obter um volume específico
router.get('/:mangaId/volumes/:volumeId', mangaController.getVolume);

// Rota para alterar um volume específico
router.put('/:mangaId/volumes/:volumeId', mangaController.updateVolume);

// Rota para deletar um volume específico
router.delete('/:mangaId/volumes/:volumeId', mangaController.deleteVolume);

module.exports = router;