const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genresController');

// Criar um novo gênero
router.post('/', genresController.createGenre);

// Obter todos os gêneros
router.get('/', genresController.getGenres);

// Obter um gênero por ID
router.get('/:id', genresController.getGenreById);

// Atualizar um gênero por ID
router.put('/:id', genresController.updateGenreById);

// Deletar um gênero por ID
router.delete('/:id', genresController.deleteGenreById);

module.exports = router;
