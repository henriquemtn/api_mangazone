const Editora = require('../models/editora');

// Criar uma nova editora
exports.createEditora = async (req, res) => {
    try {
        const editora = new Editora(req.body);
        await editora.save();
        res.status(201).send(editora);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obter todas as editoras
exports.getEditoras = async (req, res) => {
    try {
        const editoras = await Editora.find();
        res.status(200).send(editoras);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Obter uma editora por ID
exports.getEditoraById = async (req, res) => {
    try {
        const editora = await Editora.findById(req.params.id);
        if (!editora) {
            return res.status(404).send();
        }
        res.status(200).send(editora);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Atualizar uma editora por ID
exports.updateEditoraById = async (req, res) => {
    try {
        const editora = await Editora.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!editora) {
            return res.status(404).send();
        }
        res.status(200).send(editora);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Deletar uma editora por ID
exports.deleteEditoraById = async (req, res) => {
    try {
        const editora = await Editora.findByIdAndDelete(req.params.id);
        if (!editora) {
            return res.status(404).send();
        }
        res.status(200).send(editora);
    } catch (error) {
        res.status(500).send(error);
    }
};
