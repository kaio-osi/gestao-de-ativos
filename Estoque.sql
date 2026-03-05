-- FÉ EM DEUS E NAS CRIANÇAS

CREATE DATABASE IF NOT EXISTS Inventario;
USE Inventario;

-- 1. TABELA PRINCIPAL (ATIVO)
DROP TABLE IF EXISTS Ativo;
CREATE TABLE Ativo (
    AtivoID INT PRIMARY KEY AUTO_INCREMENT,
    Estacao VARCHAR(50), -- Mantido conforme solicitado
    Serie VARCHAR(50),
    Fabricante VARCHAR(50),
    Modelo VARCHAR(50),
    Usuario VARCHAR(50),
    Empresa VARCHAR(200),
    Setor VARCHAR(100),
    Status VARCHAR(50),
    Termo VARCHAR(5000),
    StatusAtivo TINYINT(1) DEFAULT 1 -- Controle de Soft Delete
);

-- 2. TABELA DE LOGS (LOGATIVOS)
DROP TABLE IF EXISTS LogAtivos;
CREATE TABLE LogAtivos (
    LogID INT PRIMARY KEY AUTO_INCREMENT,
    AtivoID INT,
    DataAlteracao DATETIME DEFAULT CURRENT_TIMESTAMP,
    Acao VARCHAR(20),
    DadosAnteriores JSON,
    DadosNovos JSON
);

-- 3. TRIGGERS DE AUDITORIA (LOGATIVOS)
DELIMITER //

DROP TRIGGER IF EXISTS trg_LogUpdateAtivo //
CREATE TRIGGER trg_LogUpdateAtivo
AFTER UPDATE ON Ativo
FOR EACH ROW
BEGIN
    DECLARE v_acao VARCHAR(20) DEFAULT 'UPDATE';
    
    IF OLD.StatusAtivo = 1 AND NEW.StatusAtivo = 0 THEN
        SET v_acao = 'SOFT_DELETE';
    END IF;

    INSERT INTO LogAtivos (AtivoID, Acao, DadosAnteriores, DadosNovos)
    VALUES (
        OLD.AtivoID, 
        v_acao,
        JSON_OBJECT(
            'estacao', OLD.Estacao, 
            'usuario', OLD.Usuario, 
            'status', OLD.Status, 
            'status_ativo', OLD.StatusAtivo
        ),
        JSON_OBJECT(
            'estacao', NEW.Estacao, 
            'usuario', NEW.Usuario, 
            'status', NEW.Status, 
            'status_ativo', NEW.StatusAtivo
        )
    );
END //

DROP TRIGGER IF EXISTS trg_LogInsertAtivo //
CREATE TRIGGER trg_LogInsertAtivo
AFTER INSERT ON Ativo
FOR EACH ROW
BEGIN
    INSERT INTO LogAtivos (AtivoID, Acao, DadosAnteriores, DadosNovos)
    VALUES (
        NEW.AtivoID, 
        'INSERT',
        NULL,
        JSON_OBJECT(
            'estacao', NEW.Estacao, 
            'usuario', NEW.Usuario, 
            'status', NEW.Status,
            'status_ativo', NEW.StatusAtivo
        )
    );
END //

DELIMITER ;

-- 4. PROCEDURES (PADRONIZADAS PARA ATIVO)

DELIMITER //

-- LISTAR
DROP PROCEDURE IF EXISTS sp_ListarAtivos //
CREATE PROCEDURE sp_ListarAtivos()
BEGIN
    SELECT * FROM Ativo 
    WHERE StatusAtivo = 1 
    ORDER BY AtivoID DESC;
END //

-- CRIAR
DROP PROCEDURE IF EXISTS sp_CriarAtivo //
CREATE PROCEDURE sp_CriarAtivo(
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
    INSERT INTO Ativo (Estacao, Serie, Fabricante, Modelo, Usuario, Empresa, Setor, Status, Termo, StatusAtivo)
    VALUES (p_estacao, p_serie, p_fabricante, p_modelo, p_usuario, p_empresa, p_setor, p_status, p_termo, 1);
    
    SELECT LAST_INSERT_ID();
END //

-- ATUALIZAR
DROP PROCEDURE IF EXISTS sp_AtualizarAtivo //
CREATE PROCEDURE sp_AtualizarAtivo(
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
    UPDATE Ativo 
    SET Estacao = p_estacao, 
        Serie = p_serie, 
        Fabricante = p_fabricante, 
        Modelo = p_modelo, 
        Usuario = p_usuario, 
        Empresa = p_empresa, 
        Setor = p_setor, 
        Status = p_status,
        Termo = p_termo
    WHERE AtivoID = p_id;
END //

-- EXCLUIR (SOFT DELETE)
DROP PROCEDURE IF EXISTS sp_ExcluirAtivo //
CREATE PROCEDURE sp_ExcluirAtivo(IN p_id INT)
BEGIN
    UPDATE Ativo 
    SET StatusAtivo = 0 
    WHERE AtivoID = p_id;
END //

DELIMITER ;

-- RESULTADO FINAL
SELECT 'EITA GLORIAAA!';
