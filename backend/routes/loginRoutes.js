const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Rotas de autenticação
router.get('/verificaSeUsuarioEstaLogado', loginController.verificaSeUsuarioEstaLogado);
router.post('/login', loginController.login);
router.post('/cadastrarCliente', loginController.cadastrarCliente);
router.post('/logout', loginController.logout);

module.exports = router;