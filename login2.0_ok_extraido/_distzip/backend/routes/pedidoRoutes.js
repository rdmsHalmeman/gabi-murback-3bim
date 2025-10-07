const express = require('express');
const router = express.Router();
const pedidoController = require('./../controllers/pedidoController');

// Rotas de Pedidos
router.get('/', pedidoController.listarPedidos);
router.post('/', pedidoController.criarPedido);
router.get('/:id', pedidoController.obterPedido);
router.put('/:id/status', pedidoController.atualizarStatusPedido);

module.exports = router;