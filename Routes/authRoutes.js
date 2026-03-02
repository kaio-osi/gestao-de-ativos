const express = require('express');
const router = express.Router();
const { autenticarNoAD } = require('./authService');

router.post('/api/login', async (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ erro: "Utilizador e senha são obrigatórios" });
    }

    const sucesso = await autenticarNoAD(usuario, senha);

    if (sucesso) {
        req.session.usuarioLogado = usuario; 
        res.json({ mensagem: "Login realizado com sucesso" });
    } else {
        res.status(401).json({ erro: "Utilizador ou senha inválidos no AD" });
    }
});