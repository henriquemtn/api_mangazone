const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.use(authMiddleware);
router.put('/update', authController.updateUser);
router.delete('/delete', authController.deleteUser);

router.get('/mangaCollection/:userId', authController.getMangaCollection); 
router.post('/addMangaToCollection', authController.addToMangaCollection); 
router.put('/addVolumeToManga', authController.addVolumeToManga);
router.delete('/mangaCollection/:mangaId', authController.deleteMangaFromCollection); // Rota para deletar um mangá da coleção
router.put('/mangaCollection/removeVolumes', authController.removeVolumesFromManga); // Rota para remover volumes de um mangá

module.exports = router;
