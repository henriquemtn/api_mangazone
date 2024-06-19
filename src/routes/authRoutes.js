const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para registro de usuário
router.post('/register', authController.register);

// Rota para login de usuário
router.post('/login', authController.login);

// Aplicar o middleware de autenticação para rotas que exigem autenticação
router.use(authMiddleware);

// Rota para atualizar informações do usuário
router.put('/update', authController.updateUser);

// Rota para deletar usuário
router.delete('/delete', authController.deleteUser);

module.exports = router;
