require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require('./auth');

// Configurações
const PORT = 3000;
const app = express();
app.use(express.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Função para gerar hash de senha
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Rota de registro de usuário
app.post('/register', (req, res) => {
    const { nome, senha } = req.body;
    if (!nome || !senha) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    const hashedPassword = hashPassword(senha);
    db.query('INSERT INTO USER (nome, senha) VALUES (?, ?)', [nome, hashedPassword], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
        res.status(201).json({retorno: "Cadastrado com sucesso", id: result.insertId, nome });
    });
});

// Rota de login de usuário
app.post('/login', (req, res) => {
    const { nome, senha } = req.body;
    if (!nome || !senha) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    db.query('SELECT * FROM USER WHERE nome = ?', [nome], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Nome ou senha inválidos' });
        }
        const hashedPassword = hashPassword(senha);
        console.log('Hashed Password:', hashedPassword); // Log temporário
        console.log('Stored Password:', results[0].senha); // Log temporário
        if (hashedPassword !== results[0].senha) {
            return res.status(401).json({ error: 'Nome ou senha inválidos' });
        }
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Middleware de autenticação
app.use(auth);

// Rota GET para listar todos os times
app.get('/teams', (req, res) => {
    db.query('SELECT * FROM TIME', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        res.json(results);
    });
});

// Rota POST para criar um novo time
app.post('/teams', (req, res) => {
    const { nome, ano_de_criacao } = req.body;
    if (!nome) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    const query = 'INSERT INTO TIME (nome, ano_de_criacao) VALUES (?, ?)';
    db.query(query, [nome, ano_de_criacao], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao criar time' });
        }
        res.status(201).json({ id: result.insertId, nome, ano_de_criacao });
    });
});

// Rota PUT para atualizar um time
app.put('/teams/:id', (req, res) => {
    const { id } = req.params;
    const { nome, ano_de_criacao } = req.body;
    
    if (!nome) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    const query = 'UPDATE TIME SET nome = ?, ano_de_criacao = ? WHERE id = ?';
    db.query(query, [nome, ano_de_criacao, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao atualizar time' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Time não encontrado' });
        }

        res.json({ message: 'Time atualizado com sucesso' });
    });
});

// Rota GET para consultar um único time
app.get('/teams/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT * FROM TIME WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar time' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Time não encontrado' });
        }

        res.json(result[0]);
    });
});

// Rota DELETE para excluir um time
app.delete('/teams/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM TIME WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao excluir time' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Time não encontrado' });
        }

        res.json({ message: 'Time excluído com sucesso' });
    });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
