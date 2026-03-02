const express = require('express');
const router = express.Router();
const controller = require('../Controller/EstoqueController');

// Define as rotas mapeando para o Controller
router.get('/', controller.listar);
router.post('/', controller.cadastrar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

module.exports = router;