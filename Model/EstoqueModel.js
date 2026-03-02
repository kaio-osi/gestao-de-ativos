const db = require('../Configs/db');

class Estacao {
    static async listarTudo() {

        const [result] = await db.execute('CALL sp_ListarEstacoes()');
        return result ? result[0] : [];
    }

    static async criar(dados) {
        const sql = 'CALL sp_CriarEstacao(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const valores = [
            dados.estacao, dados.serie, dados.fabricante, 
            dados.modelo, dados.usuario, dados.empresa, 
            dados.setor, dados.status, dados.termo
        ];

        const [result] = await db.execute(sql, valores);

        const novoId = result[0][0].id;

        return { 
            mensagem: "Cadastrado com sucesso!", 
            id: novoId, 
            ...dados 
        };
    }

    static async atualizar(id, dados) {
        const sql = 'CALL sp_AtualizarEstacao(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const valores = [
            id, dados.estacao, dados.serie, dados.fabricante, dados.modelo,
            dados.usuario, dados.empresa, dados.setor, dados.status, dados.termo
        ];

        await db.execute(sql, valores);
        return { id, ...dados };
    }

    static async excluir(EstacaoID) {
        const [result] = await db.execute('CALL sp_ExcluirEstacao(?)', [EstacaoID]);
        return true; 
    }
}

module.exports = Estacao;