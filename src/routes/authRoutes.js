const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas publicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/id/:id', authController.getUserByID);
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

router.put('/addCharacter', authController.addCharacterToFavorites); // Rota para adicionar personagem aos favoritos
router.put('/removeCharacter', authController.removeCharacterFromFavorites);

router.put('/addFavorites', authController.addMangaToFavorites); // Rota para adicionar personagem aos favoritos
router.put('/removeFavorites', authController.removeMangaFromFavorites);

router.put('/addPeoples', authController.addArtistToFavorites); // Rota para adicionar personagem aos favoritos
router.put('/removePeoples', authController.removeArtistFromFavorites);

router.put('/addFriend', authController.addFriend);
router.put('/removeFriend', authController.removeFriend);



module.exports = router;
