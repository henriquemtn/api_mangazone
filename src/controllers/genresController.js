const Genres = require('../models/genres');

// Criar um novo gênero
exports.createGenre = async (req, res) => {
    try {
        const genre = new Genres(req.body);
        await genre.save();
        res.status(201).send(genre);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obter todos os gêneros
exports.getGenres = async (req, res) => {
    try {
        const genres = await Genres.find();
        res.status(200).send(genres);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Obter um gênero por ID
exports.getGenreById = async (req, res) => {
    try {
        const genre = await Genres.findById(req.params.id);
        if (!genre) {
            return res.status(404).send();
        }
        res.status(200).send(genre);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Atualizar um gênero por ID
exports.updateGenreById = async (req, res) => {
    try {
        const genre = await Genres.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!genre) {
            return res.status(404).send();
        }
        res.status(200).send(genre);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Deletar um gênero por ID
exports.deleteGenreById = async (req, res) => {
    try {
        const genre = await Genres.findByIdAndDelete(req.params.id);
        if (!genre) {
            return res.status(404).send();
        }
        res.status(200).send(genre);
    } catch (error) {
        res.status(500).send(error);
    }
};
