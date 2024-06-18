const express = require('express');
const cors = require('cors');
const conn = require('./db/conn');
const routerApp = require('./routes/router');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
conn();

// Rotas
app.use('/api', routerApp);

// Catch-all route para lidar com todas as outras requisições
app.get('*', (req, res) => {
  res.status(404).send('Rota não encontrada');
});

app.listen(PORT, () => {
  console.log(`Servidor Online na porta ${PORT}!`);
});
