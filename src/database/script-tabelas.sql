-- este é a primeira versão do banco de dados, é só para testar as funcionalidades de criação e autenticação de usuário
CREATE DATABASE microhub;

USE microhub;

CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
senha VARCHAR(255) NOT NULL,
email VARCHAR(100) NOT NULL
);

select * from usuarios;

INSERT INTO usuarios (nome, senha, email) VALUES ('samuel', SHA2('senha123', 256), 'samuel.correia@gmail.com');