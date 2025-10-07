const express = require('express');
const router = express.Router();
const franquiaController = require('../controllers/franquiaController');

router.get('/', franquiaController.listarFranquias);
router.post('/', franquiaController.criarFranquia);
router.get('/:id', franquiaController.obterFranquia);
router.put('/:id', franquiaController.atualizarFranquia);
router.delete('/:id', franquiaController.deletarFranquia);

module.exports = router;

