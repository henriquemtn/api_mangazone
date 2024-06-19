const VoiceActor = require('../models/voiceActor');
const mongoose = require('mongoose');

// Adicionar um dublador
exports.addVoiceActor = async (req, res) => {
    const { name, photoUrl, birthday, nationality, favorites, biography, dubCharacters } = req.body;

    try {
        const newVoiceActor = new VoiceActor({
            name,
            photoUrl,
            birthday,
            nationality,
            favorites,
            biography,
            dubCharacters
        });

        await newVoiceActor.save();

        res.status(201).json({ message: 'Dublador adicionado com sucesso', voiceActor: newVoiceActor });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// Obter todos os dubladores
exports.getAllVoiceActors = async (req, res) => {
    try {
        const voiceActors = await VoiceActor.find();
        res.json(voiceActors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// Obter um dublador por ID
exports.getVoiceActorById = async (req, res) => {
    const { id } = req.params;

    try {
        const voiceActor = await VoiceActor.findById(id);
        if (!voiceActor) {
            return res.status(404).json({ message: 'Dublador não encontrado' });
        }
        res.json(voiceActor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// Atualizar um dublador
exports.updateVoiceActor = async (req, res) => {
    const { id } = req.params;
    const { name, photoUrl, birthday, nationality, favorites, biography, dubCharacters } = req.body;

    try {
        let voiceActor = await VoiceActor.findById(id);
        if (!voiceActor) {
            return res.status(404).json({ message: 'Dublador não encontrado' });
        }

        voiceActor.name = name;
        voiceActor.photoUrl = photoUrl;
        voiceActor.birthday = birthday;
        voiceActor.nationality = nationality;
        voiceActor.favorites = favorites;
        voiceActor.biography = biography;
        voiceActor.dubCharacters = dubCharacters;

        await voiceActor.save();

        res.json({ message: 'Dublador atualizado com sucesso', voiceActor });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// Deletar um dublador
exports.deleteVoiceActor = async (req, res) => {
    const { id } = req.params;

    try {
        const voiceActor = await VoiceActor.findById(id);
        if (!voiceActor) {
            return res.status(404).json({ message: 'Dublador não encontrado' });
        }

        await voiceActor.remove();

        res.json({ message: 'Dublador deletado com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};