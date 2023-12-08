const express = require('express');
const app = express();
const cors = require('cors');
const port = 5500; // Você pode escolher a porta que desejar
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://127.0.0.1:27017/Municipios_Brasileiros', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
// Rota GET simples
app.use(express.json());
app.use(cors());

db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
db.once('open', () => {
    console.log('Conectado ao banco de dados MongoDB');
});
const City = mongoose.model('Cidades', {
    "municipio-id": Number,
    "municipio-nome": String,
    "microrregiao-id": Number,
    "microrregiao-nome": String,
    "mesorregiao-id": Number,
    "mesorregiao-nome": String,
    "regiao-imediata-id": Number,
    "regiao-imediata-nome": String,
    "regiao-intermediaria-id": Number,
    "regiao-intermediaria-nome": String,
    "UF-id": Number,
    "UF-sigla": String,
    "UF-nome": String,
    "regiao-id": Number,
    "regiao-sigla": String,
    "regiao-nome": String
});

app.get('/consulta', async(req, res) => {
    try {
        const cidades = await City.find();
        console.log(cidades)
        res.json(cidades);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar alunos' });
    }
});

app.get('/consulta/estado/:estado', async (req, res) => {
    try {
        const estado = req.params.estado;
        const cidades = await City.find({ "UF-nome": estado }).select('municipio-nome');;
        console.log(cidades);
        res.json(cidades);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cidades' });
    }
});

app.get('/consulta/cidade/:cidade', async (req, res) => {
    try {
        const cidade = req.params.cidade;
        const cidades = await City.find({ "municipio-nome": cidade }).select({
            "municipio-nome": 1,
            "mesorregiao-nome": 1,
            "UF-nome": 1,
            "UF-sigla": 1,
            "regiao-nome": 1,
            _id: 0 // Para excluir o campo _id da resposta
        });
        console.log(cidades);
        res.json(cidades);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cidades' });
    }
});


// app.post('/criar', async(req, res) => {
//     try {
//         const {
//             nome,
//             idade,
//             curso,
//             matricula,
//             notas
//         } = req.body;

//         const novoEstudante = new Student({
//             nome,
//             idade,
//             curso,
//             matricula,
//             notas
//         });

//         await novoEstudante.save();
//         res.json(novoEstudante);
//     } catch (err) {
//         res.status(400).json({ error: 'Erro ao criar estudante.' });
//     }
// });

// Iniciar o servidor na porta especificada
app.listen(port, () => {
    console.log(`O servidor está ouvindo na porta ${port}`);
});