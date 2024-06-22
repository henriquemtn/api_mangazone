const Artist = require("../models/artist");
const mongoose = require("mongoose");

// Adicionar um artista
exports.addArtist = async (req, res) => {
  const {
    name,
    photoUrl,
    birthday,
    nationality,
    favorites,
    biography,
    dubCharacters,
    role,
  } = req.body;

  try {
    const newArtist = new Artist({
      name,
      photoUrl,
      birthday,
      nationality,
      favorites,
      biography,
      dubCharacters,
      role,
    });

    await newArtist.save();

    res
      .status(201)
      .json({
        message: "Artista adicionado com sucesso",
        artist: newArtist,
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Obter todos os artistas
exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Obter todos os artistas com role "author"
exports.getAuthors = async (req, res) => {
  try {
    const authors = await Artist.find({ role: "author" });
    res.json(authors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Obter todos os artistas com role "voiceActor"
exports.getVoiceActors = async (req, res) => {
  try {
    const voiceActors = await Artist.find({ role: "voiceActor" });
    res.json(voiceActors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Obter um artista por ID
exports.getArtistById = async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artista não encontrado" });
    }
    res.json(artist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Atualizar um artista
exports.updateArtist = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    photoUrl,
    birthday,
    nationality,
    favorites,
    biography,
    dubCharacters,
    role,
  } = req.body;

  try {
    let artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artista não encontrado" });
    }

    artist.name = name;
    artist.photoUrl = photoUrl;
    artist.birthday = birthday;
    artist.nationality = nationality;
    artist.favorites = favorites;
    artist.biography = biography;
    artist.dubCharacters = dubCharacters;
    artist.role = role;

    await artist.save();

    res.json({ message: "Artista atualizado com sucesso", artist });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Deletar um artista
exports.deleteArtist = async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artista não encontrado" });
    }

    await artist.deleteOne();

    res.json({ message: "Artista deletado com sucesso" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Adicionar um novo personagem ao artista
exports.addDubCharacter = async (req, res) => {
  const { id } = req.params;
  const { mangaId, characterId } = req.body;

  try {
    let artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artista não encontrado" });
    }

    // Adiciona o novo personagem ao campo dubCharacters
    artist.dubCharacters.push({
      mangaId,
      charactersId: [characterId]
    });

    await artist.save();

    res.json({ message: "Personagem adicionado com sucesso", artist });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Adicionar um novo mangaId ao campo mangasRelationship de um artista
exports.addMangaRelationship = async (req, res) => {
  const { id } = req.params;
  const { mangaId } = req.body;

  try {
    let artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artista não encontrado" });
    }

    // Adiciona o novo mangaId ao campo mangasRelationship
    artist.mangasRelationship.push(mangaId);

    await artist.save();

    res.json({ message: "Relação de manga adicionada com sucesso", artist });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Remover um mangaId do campo mangasRelationship de um artista
exports.removeMangaRelationship = async (req, res) => {
  const { id } = req.params;
  const { mangaId } = req.body;

  try {
    let artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artista não encontrado" });
    }

    console.log("Before removal:", artist.mangasRelationship);

    // Remove o mangaId do campo mangasRelationship
    artist.mangasRelationship = artist.mangasRelationship.filter(manga => !manga.equals(mangaId));

    console.log("After removal:", artist.mangasRelationship);

    await artist.save();

    res.json({ message: "Relação de manga removida com sucesso", artist });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Buscar um autor pelo nome
exports.getArtistByName = async (req, res) => {
  const { name } = req.params;

  try {
    // Utilize findOne com uma expressão regular para busca insensível a maiúsculas/minúsculas
    const artist = await Artist.findOne({ name: { $regex: new RegExp(name, 'i') } });

    if (!artist) {
      return res.status(404).json({ message: "Autor não encontrado" });
    }

    res.json(artist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};
