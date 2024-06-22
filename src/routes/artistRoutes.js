const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");

// Rota para obter artistas especificos, 
// devem ser iniciadas no topo para nao iniciarem como paramsId
router.get("/authors", artistController.getAuthors);
router.get("/voiceActors", artistController.getVoiceActors);

// Rota para adicionar um artista
router.post("/", artistController.addArtist);

// Rota para obter todos os artistas
router.get("/", artistController.getAllArtists);
router.get('/name/:name', artistController.getArtistByName);


// Rota para obter um artista por ID
router.get("/:id", artistController.getArtistById);

// Rota para atualizar um artista por ID
router.put("/:id", artistController.updateArtist);

router.put("/:id/addMangaRelationship", artistController.addMangaRelationship);
router.put("/:id/removeMangaRelationship", artistController.removeMangaRelationship);

// Rota para deletar um artista por ID
router.delete("/:id", artistController.deleteArtist);

module.exports = router;
