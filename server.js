const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/escalaDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Conectado ao MongoDB');
});

// Modelo de Escala
const escalaSchema = new mongoose.Schema({
    category: String,
    name: String,
    sector: String,
    shift: String,
    startDate: Date,
    startTime: String,
    endDate: Date,
    endTime: String,
    workHours: String,
});

const Escala = mongoose.model('Escala', escalaSchema);

// Rota para adicionar uma entrada
app.post('/add', (req, res) => {
    const newEntry = new Escala(req.body);
    newEntry.save((err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Entrada adicionada com sucesso!');
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
