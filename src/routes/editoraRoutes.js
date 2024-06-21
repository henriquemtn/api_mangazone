const express = require('express');
const router = express.Router();
const editoraController = require('../controllers/editoraController');

// Criar uma nova editora
router.post('/', editoraController.createEditora);

// Obter todas as editoras
router.get('/', editoraController.getEditoras);

// Obter uma editora por ID
router.get('/:id', editoraController.getEditoraById);

// Atualizar uma editora por ID
router.put('/:id', editoraController.updateEditoraById);

// Deletar uma editora por ID
router.delete('/:id', editoraController.deleteEditoraById);

module.exports = router;