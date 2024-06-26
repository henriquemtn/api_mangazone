const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/mangaController');

router.post('/', mangaController.createManga);
router.get('/', mangaController.getAllMangas);
router.get('/:id', mangaController.getMangaById);
router.put('/:id', mangaController.updateManga);
router.delete('/:id', mangaController.deleteManga);
router.post('/:mangaId/volumes', mangaController.addVolume);
router.get('/:mangaId/volumes', mangaController.listVolumes);
router.get('/:mangaId/volumes/:volumeId', mangaController.getVolume);
router.put('/:mangaId/volumes/:volumeId', mangaController.updateVolume);
router.delete('/:mangaId/volumes/:volumeId', mangaController.deleteVolume);

// Rotas para adicionar e remover personagens
router.put('/:mangaId/addCharacter', mangaController.addCharacterToManga);
router.put('/:mangaId/removeCharacter', mangaController.removeCharacterFromManga);

module.exports = router;
