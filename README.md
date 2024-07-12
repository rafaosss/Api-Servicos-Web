# API de Times de Futebol

Esta é uma API simples de times de futebol que permite realizar operações CRUD (Create, Read, Update, Delete) utilizando Node.js, MySQL e JWT para autenticação.

Pré-requisitos:

Antes de começar, certifique-se de ter instalado em sua máquina:

- Node.js (versão 14 ou superior)
- MySQL Server
- Um editor de texto ou IDE de sua preferência

Instale as dependências: npm install

Configuração do Banco de Dados

Crie um banco de dados MySQL chamado timesfutebol (ou o nome que preferir):

- Execute o script SQL para criar as tabelas e inserir dados iniciais. Você pode usar o script fornecido (criar_banco.sql) para isso.

- Substitua seu_usuario pelo seu usuário do MySQL e digite sua senha quando solicitado.

Variáveis de Ambiente:

- Renomeie o arquivo .env.example para .env e ajuste as variáveis de ambiente conforme necessário:

DB_HOST=seu_host_mysql

DB_USER=seu_usuario_mysql

DB_PASSWORD=sua_senha_mysql

DB_NAME=timesfutebol

JWT_SECRET=sua_chave_secreta_jwt

Executando a Aplicação: npm start

Uso da API:
A API se encontra na seguinte documentação: https://documenter.getpostman.com/view/26202306/2sA3e5e8A3

Obs: É necessário criar um usuário no /register, após isso, utilizar o /log para obter o token e seguir utilizando ele para os outros endpoints.
