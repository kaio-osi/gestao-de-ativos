-- Agile Connect

CREATE DATABASE IF NOT EXISTS Estoque;
USE Estoque;

-- 1. TABELA PRINCIPAL (ESTAÇÕES)
DROP TABLE IF EXISTS Estacao;
CREATE TABLE Estacao (
    EstacaoID INT PRIMARY KEY AUTO_INCREMENT,
    Estacao VARCHAR(50),
    Serie VARCHAR(50),
    Fabricante VARCHAR(50),
    Modelo VARCHAR(50),
    Usuario VARCHAR(50),
    Empresa VARCHAR(200),
    Setor VARCHAR(100),
    Status VARCHAR(50),
    Termo VARCHAR(5000),
    Ativo TINYINT(1) DEFAULT 1 
);

-- 2. TABELA DE LOGS 
DROP TABLE IF EXISTS LogEstoque;
CREATE TABLE LogEstoque (
    LogID INT PRIMARY KEY AUTO_INCREMENT,
    EstacaoID INT,
    DataAlteracao DATETIME DEFAULT CURRENT_TIMESTAMP,
    Acao VARCHAR(20),
    DadosAnteriores JSON,
    DadosNovos JSON
);



-- 3. TRIGGERS DE AUDITORIA 
DELIMITER //

DROP TRIGGER IF EXISTS trg_LogUpdateEstacao //
CREATE TRIGGER trg_LogUpdateEstacao
AFTER UPDATE ON Estacao
FOR EACH ROW
BEGIN
    DECLARE v_acao VARCHAR(20) DEFAULT 'UPDATE';
    
    IF OLD.Ativo = 1 AND NEW.Ativo = 0 THEN
        SET v_acao = 'SOFT_DELETE';
    END IF;

    INSERT INTO LogEstoque (EstacaoID, Acao, DadosAnteriores, DadosNovos)
    VALUES (
        OLD.EstacaoID, 
        v_acao,
        JSON_OBJECT(
            'estacao', OLD.Estacao, 
            'usuario', OLD.Usuario, 
            'status', OLD.Status, 
            'setor', OLD.Setor,
            'ativo', OLD.Ativo
        ),
        JSON_OBJECT(
            'estacao', NEW.Estacao, 
            'usuario', NEW.Usuario, 
            'status', NEW.Status, 
            'setor', NEW.Setor,
            'ativo', NEW.Ativo
        )
    );
END //



DELIMITER ;

DELIMITER //

DROP TRIGGER IF EXISTS trg_LogInsertEstacao //
CREATE TRIGGER trg_LogInsertEstacao
AFTER INSERT ON Estacao
FOR EACH ROW
BEGIN
    INSERT INTO LogEstoque (EstacaoID, Acao, DadosAnteriores, DadosNovos)
    VALUES (
        NEW.EstacaoID, 
        'INSERT',
        NULL, -- Não existe dado anterior na inserção
        JSON_OBJECT(
            'estacao', NEW.Estacao, 
            'usuario', NEW.Usuario, 
            'status', NEW.Status,
            'ativo', NEW.Ativo
        )
    );
END //

DELIMITER ;

-- 4. Procs

DELIMITER //

-- LISTAR
DROP PROCEDURE IF EXISTS sp_ListarEstacoes //
CREATE PROCEDURE sp_ListarEstacoes()
BEGIN
    SELECT * FROM Estacao 
    WHERE Ativo = 1 
    ORDER BY EstacaoID DESC;
END //



-- CRIAR
DROP PROCEDURE IF EXISTS sp_CriarEstacao //
CREATE PROCEDURE sp_CriarEstacao(
    IN p_estacao VARCHAR(50),
    IN p_serie VARCHAR(50),
    IN p_fabricante VARCHAR(50),
    IN p_modelo VARCHAR(50),
    IN p_usuario VARCHAR(50),
    IN p_empresa VARCHAR(200),
    IN p_setor VARCHAR(100),
    IN p_status VARCHAR(50),
    IN p_termo VARCHAR(5000)
)
BEGIN
    INSERT INTO Estacao (Estacao, Serie, Fabricante, Modelo, Usuario, Empresa, Setor, Status, Termo, Ativo)
    VALUES (p_estacao, p_serie, p_fabricante, p_modelo, p_usuario, p_empresa, p_setor, p_status, p_termo, 1);
    
    SELECT LAST_INSERT_ID() AS ID;
END //

-- ATUALIZAR
DROP PROCEDURE IF EXISTS sp_AtualizarEstacao //
CREATE PROCEDURE sp_AtualizarEstacao(
    IN p_id INT,
    IN p_estacao VARCHAR(50),
    IN p_serie VARCHAR(50),
    IN p_fabricante VARCHAR(50),
    IN p_modelo VARCHAR(50),
    IN p_usuario VARCHAR(50),
    IN p_empresa VARCHAR(200),
    IN p_setor VARCHAR(100),
    IN p_status VARCHAR(50),
    IN p_termo VARCHAR(5000)
)
BEGIN
    UPDATE Estacao 
    SET Estacao = p_estacao, 
        Serie = p_serie, 
        Fabricante = p_fabricante, 
        Modelo = p_modelo, 
        Usuario = p_usuario, 
        Empresa = p_empresa, 
        Setor = p_setor, 
        Status = p_status,
        Termo = p_termo
    WHERE EstacaoID = p_id;
END //

-- SOFT DELETE
DROP PROCEDURE IF EXISTS sp_ExcluirEstacao //
CREATE PROCEDURE sp_ExcluirEstacao(IN p_id INT)
BEGIN
    UPDATE Estacao 
    SET Ativo = 0 
    WHERE EstacaoID = p_id;
END //

DELIMITER ;

SELECT 'EITA GLORIAAA!' AS RESULTADO;