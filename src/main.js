require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conn = require('./db/conn');

const mangaRoutes = require('./routes/mangaRoutes');
const authRoutes = require('./routes/authRoutes');
const characterRoutes = require('./routes/characterRoutes');
const artistRoutes = require('./routes/artistRoutes');
const genresRoutes = require('./routes/genresRoutes');
const editoraRoutes = require('./routes/editoraRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

conn();

app.use('/api/user', authRoutes);
app.use('/api/mangas', mangaRoutes)
app.use('/api/mangas', characterRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/editoras', editoraRoutes);

app.get('*', (req, res) => {
  res.status(404).send('Rota não encontrada');
});

app.listen(PORT, () => {
  console.log(`Servidor Online na porta ${PORT}!`);
});
