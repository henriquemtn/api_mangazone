const Manga = require("../models/manga");

// Criar um novo mangá
exports.createManga = async (req, res) => {
  try {
    const {
      title,
      author,
      releaseDate,
      alternativeTitles,
      genres,
      imageUrl,
      publisherBy,
      synopsis,
      score,
      characters,
      volumes,
      reviews,
    } = req.body;

    const manga = new Manga({
      title,
      author,
      releaseDate,
      alternativeTitles,
      genres,
      imageUrl,
      publisherBy,
      synopsis,
      score,
      characters,
      volumes,
      reviews,
    });

    await manga.save();

    res.status(201).json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao criar mangá");
  }
};

// Obter todos os mangás (com filtro opcional por nome)
exports.getAllMangas = async (req, res) => {
  try {
    const { nome } = req.query;
    let query = {};
    if (nome) {
      query = { title: { $regex: new RegExp(nome, 'i') } };
    }
    const mangas = await Manga.find(query);
    res.json(mangas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao buscar mangás");
  }
};

// Obter um mangá por ID
exports.getMangaById = async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }
    res.json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao buscar mangá");
  }
};

// Atualizar um mangá por ID
exports.updateManga = async (req, res) => {
  try {
    const {
      title,
      author,
      releaseDate,
      alternativeTitles,
      genres,
      imageUrl,
      publisherBy,
      synopsis,
      score,
      characters,
      volumes,
      reviews,
    } = req.body;

    const manga = await Manga.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        releaseDate,
        alternativeTitles,
        genres,
        imageUrl,
        publisherBy,
        synopsis,
        score,
        characters,
        volumes,
        reviews,
      },
      { new: true }
    );

    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    res.json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao atualizar mangá");
  }
};

// Deletar um mangá por ID
exports.deleteManga = async (req, res) => {
  try {
    const manga = await Manga.findByIdAndDelete(req.params.id);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }
    res.json({ message: "Mangá deletado com sucesso" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao deletar mangá");
  }
};

// Adicionar volume a um mangá específico
exports.addVolume = async (req, res) => {
  const { mangaId } = req.params;
  const { number, date, alternativeCover, image, linkAmazon, price, chapters } = req.body;

  try {
    // Encontra o mangá pelo ID
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    // Cria um novo volume
    const newVolume = {
      number,
      date,
      alternativeCover,
      chapters,
      image,
      linkAmazon,
      price,
    };

    // Adiciona o volume ao array de volumes do mangá
    manga.volumes.push(newVolume);

    // Salva as alterações no banco de dados
    await manga.save();

    res.status(201).json({ message: "Volume adicionado com sucesso", manga });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao adicionar volume ao mangá");
  }
};

// Listar todos os volumes de um mangá específico
exports.listVolumes = async (req, res) => {
  const { mangaId } = req.params;

  try {
    // Encontra o mangá pelo ID
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    // Retorna os volumes do mangá
    res.json(manga.volumes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao listar volumes do mangá");
  }
};

// Obter um volume específico de um mangá
exports.getVolume = async (req, res) => {
  const { mangaId, volumeId } = req.params;

  try {
    // Encontra o mangá pelo ID
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    // Encontra o volume pelo ID
    const volume = manga.volumes.find((vol) => vol._id == volumeId);
    if (!volume) {
      return res.status(404).json({ message: "Volume não encontrado" });
    }

    // Retorna o volume encontrado
    res.json(volume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao obter volume do mangá");
  }
};

// Atualizar um volume específico de um mangá
exports.updateVolume = async (req, res) => {
  const { mangaId, volumeId } = req.params;
  const { number, date, alternativeCover, image, linkAmazon, price } = req.body;

  try {
    // Encontra o mangá pelo ID
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    // Encontra o volume pelo ID
    const volume = manga.volumes.find((vol) => vol._id == volumeId);
    if (!volume) {
      return res.status(404).json({ message: "Volume não encontrado" });
    }

    // Atualiza as informações do volume
    volume.number = number;
    volume.date = date;
    volume.alternativeCover = alternativeCover;
    volume.image = image;
    volume.linkAmazon = linkAmazon;
    volume.price = price;

    // Salva as alterações no banco de dados
    await manga.save();

    res.json({ message: "Volume atualizado com sucesso", volume });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao atualizar volume do mangá");
  }
};

// Deletar um volume específico de um mangá
exports.deleteVolume = async (req, res) => {
  const { mangaId, volumeId } = req.params;

  try {
    // Encontra o mangá pelo ID
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    // Remove o volume pelo ID
    manga.volumes = manga.volumes.filter((vol) => vol._id != volumeId);

    // Salva as alterações no banco de dados
    await manga.save();

    res.json({ message: "Volume deletado com sucesso" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao deletar volume do mangá");
  }
};

// Adicionar um personagem a um mangá
exports.addCharacterToManga = async (req, res) => {
  const { mangaId } = req.params;
  const { characterId } = req.body;

  try {
    // Encontra o mangá pelo ID
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    // Verifica se o personagem já está adicionado
    if (manga.characters.includes(characterId)) {
      return res.status(400).json({ message: "Personagem já adicionado ao mangá" });
    }

    // Adiciona o ID do personagem ao array de characters do mangá
    manga.characters.push(characterId);

    // Salva as alterações no banco de dados
    await manga.save();

    res.json({ message: "Personagem adicionado com sucesso ao mangá", manga });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao adicionar personagem ao mangá");
  }
};

// Remover um personagem de um mangá
exports.removeCharacterFromManga = async (req, res) => {
  const { mangaId } = req.params;
  const { characterId } = req.body;

  try {
    // Encontra o mangá pelo ID
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    // Verifica se o personagem está no mangá
    if (!manga.characters.includes(characterId)) {
      return res.status(400).json({ message: "Personagem não encontrado no mangá" });
    }

    // Remove o ID do personagem do array de characters do mangá
    manga.characters = manga.characters.filter((id) => id.toString() !== characterId);

    // Salva as alterações no banco de dados
    await manga.save();

    res.json({ message: "Personagem removido com sucesso do mangá", manga });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao remover personagem do mangá");
  }
};
