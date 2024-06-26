const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas publicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/:username', authController.getUserByUsername);
router.get('/:username/mangaCollection', authController.getMangaCollection); 
router.get('/:username/checkMangaInCollection/:mangaId', authController.checkMangaInCollection);

router.use(authMiddleware);

// Rotas protegidas
router.put('/update', authController.updateUser);
router.delete('/delete', authController.deleteUser);
router.post('/addMangaToCollection', authController.addToMangaCollection); 
router.put('/addVolumeToManga', authController.addVolumeToManga);
router.delete('/mangaCollection/:mangaId', authController.deleteMangaFromCollection); // Rota para deletar um mangá da coleção
router.put('/mangaCollection/removeVolumes', authController.removeVolumesFromManga); // Rota para remover volumes de um mangá

module.exports = router;
