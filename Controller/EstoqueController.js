const Estacao = require('../Model/EstoqueModel');

exports.listar = async (req, res) => {
    try {
        const dados = await Estacao.listarTudo();
        res.status(200).json(dados);
    } catch (err) {
        console.error("Erro ao listar:", err);
        res.status(500).json({ erro: "Erro ao buscar dados no servidor." });
    }
};

exports.cadastrar = async (req, res) => {
    try {
        const nova = await Estacao.criar(req.body);
        res.status(201).json(nova);
    } catch (err) {
        console.error("Erro ao cadastrar:", err);
        res.status(500).json({ erro: "Erro ao salvar o registro no banco." });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params; // O ID vem da URL (ex: /api/estacoes/10)
        const atualizada = await Estacao.atualizar(id, req.body);
        res.status(200).json(atualizada);
    } catch (err) {
        console.error("Erro ao atualizar:", err);
        res.status(500).json({ erro: "Erro ao atualizar o registro." });
    }
};

exports.excluir = async (req, res) => {
    try {
        const { id } = req.params;
        await Estacao.excluir(id);
        res.status(200).json({ mensagem: "Registro removido com sucesso!" });
    } catch (err) {
        console.error("Erro ao excluir:", err);
        res.status(500).json({ erro: "Erro ao excluir o registro." });
    }
};