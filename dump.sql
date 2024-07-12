-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS timesfutebol;

-- Usar o banco de dados criado
USE timesfutebol;

-- Criar tabela TIME
CREATE TABLE IF NOT EXISTS TIME (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    ano_de_criacao INT
);

-- Criar tabela USER
CREATE TABLE IF NOT EXISTS USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(100) NOT NULL
);

-- Inserir dados iniciais
INSERT INTO TIME (nome, ano_de_criacao) VALUES
    ('Internacional', 1909),
    ('Grêmio', 1903);
