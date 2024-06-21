const Manga = require("../models/manga");
const VoiceActor = require("../models/artist");

// Adicionar personagem a um mangá
exports.addCharacter = async (req, res) => {
  const { mangaId } = req.params;
  const { name, photoUrl, spoiler, age, biography, voiceActors } = req.body;

  // Verificação dos campos obrigatórios
  if (!name) {
    return res.status(400).json({ message: "O campo `name` é obrigatório." });
  }

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    const newCharacter = {
      name,
      photoUrl,
      spoiler,
      age,
      biography,
      voiceActors: [],
    };
    manga.characters.push(newCharacter);

    // Logging do estado do Manga antes de salvar
    console.log(
      "Estado do Manga antes de salvar:",
      JSON.stringify(manga, null, 2)
    );

    await manga.save();

    res.status(201).json({
      message: "Personagem adicionado com sucesso",
      character: newCharacter,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Obter todos os personagens de um mangá
exports.getCharactersByManga = async (req, res) => {
  const { mangaId } = req.params;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    const characters = manga.characters;
    res.json({ characters });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Obter um único personagem por ID
exports.getCharacterById = async (req, res) => {
  const { mangaId, characterId } = req.params;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    const character = manga.characters.id(characterId);
    if (!character) {
      return res.status(404).json({ message: "Personagem não encontrado" });
    }

    res.json({ character });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Atualizar um personagem
exports.updateCharacter = async (req, res) => {
  const { mangaId, characterId } = req.params;
  const { name, photoUrl, spoiler, age, biography } = req.body;

  // Verificação dos campos obrigatórios
  if (!name) {
    return res.status(400).json({ message: "O campo `name` é obrigatório." });
  }

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    const character = manga.characters.id(characterId);
    if (!character) {
      return res.status(404).json({ message: "Personagem não encontrado" });
    }

    character.name = name;
    character.photoUrl = photoUrl;
    character.spoiler = spoiler;
    character.age = age;
    character.biography = biography;

    await manga.save();

    res.json({ message: "Personagem atualizado com sucesso", character });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.deleteCharacter = async (req, res) => {
  const { mangaId, characterId } = req.params;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      console.log("Mangá não encontrado:", mangaId);
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    const character = manga.characters.id(characterId);
    if (!character) {
      console.log("Personagem não encontrado:", characterId);
      return res.status(404).json({ message: "Personagem não encontrado" });
    }

    // Use the pull method to remove the character from the array
    manga.characters.pull({ _id: characterId });

    // Log do estado do manga após a remoção do personagem
    console.log("Estado do manga após remoção do personagem:", JSON.stringify(manga, null, 2));

    await manga.save();

    res.json({ message: "Personagem deletado com sucesso" });
  } catch (err) {
    console.error("Erro no servidor ao deletar personagem:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Adicionar um dublador a um personagem existente
exports.addVoiceActorToCharacter = async (req, res) => {
  const { mangaId, characterId, voiceActorId } = req.params;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    const character = manga.characters.id(characterId);
    if (!character) {
      return res.status(404).json({ message: "Personagem não encontrado" });
    }

    const voiceActor = await VoiceActor.findById(voiceActorId);
    if (!voiceActor) {
      return res.status(404).json({ message: "Dublador não encontrado" });
    }

    // Verifica se o dublador já está associado ao personagem
    const existingVoiceActor = character.voiceActors.some(
      (va) => va.toString() === voiceActor._id.toString()
    );
    if (existingVoiceActor) {
      return res.status(400).json({
        message: "Este dublador já está associado ao personagem",
      });
    }

    // Adiciona o ID do dublador à lista de dubladores do personagem
    character.voiceActors.push(voiceActor._id);

    // Adiciona o personagem ao dublador se não estiver presente
    const existingDubCharacter = voiceActor.dubCharacters.find(
      (dc) => dc.mangaId.toString() === mangaId.toString()
    );

    if (existingDubCharacter) {
      if (!existingDubCharacter.charactersId.includes(characterId)) {
        existingDubCharacter.charactersId.push(characterId);
      }
    } else {
      voiceActor.dubCharacters.push({
        mangaId: mangaId,
        charactersId: [characterId],
      });
    }

    await voiceActor.save(); // Salva o dublador atualizado
    await manga.save(); // Salva o manga com o dublador adicionado ao personagem

    res.json({
      message: "Dublador adicionado ao personagem com sucesso",
      character,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Atualizar um dublador
exports.updateVoiceActor = async (req, res) => {
  const { mangaId, characterId, voiceActorId } = req.params;
  const { name, photoUrl, birthday, nationality, favorites, biography } =
    req.body;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    const character = manga.characters.id(characterId);
    if (!character) {
      return res.status(404).json({ message: "Personagem não encontrado" });
    }

    const voiceActor = character.voiceActors.id(voiceActorId);
    if (!voiceActor) {
      return res.status(404).json({ message: "Dublador não encontrado" });
    }

    voiceActor.name = name;
    voiceActor.photoUrl = photoUrl;
    voiceActor.birthday = birthday;
    voiceActor.nationality = nationality;
    voiceActor.favorites = favorites;
    voiceActor.biography = biography;

    await manga.save();

    res.json({ message: "Dublador atualizado com sucesso", voiceActor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Remover um dublador de um personagem
exports.removeVoiceActorFromCharacter = async (req, res) => {
    const { mangaId, characterId, voiceActorId } = req.params;
  
    try {
      const manga = await Manga.findById(mangaId);
      if (!manga) {
        return res.status(404).json({ message: "Mangá não encontrado" });
      }
  
      const character = manga.characters.id(characterId);
      if (!character) {
        return res.status(404).json({ message: "Personagem não encontrado" });
      }
  
      const voiceActor = await VoiceActor.findById(voiceActorId);
      if (!voiceActor) {
        return res.status(404).json({ message: "Dublador não encontrado" });
      }
  
      // Verifica se o dublador está associado ao personagem
      const existingVoiceActorIndex = character.voiceActors.findIndex(
        va => va.toString() === voiceActor._id.toString()
      );
      if (existingVoiceActorIndex === -1) {
        return res.status(404).json({
          message: "Este dublador não está associado ao personagem",
        });
      }
  
      // Remove o dublador da lista de dubladores do personagem
      character.voiceActors.splice(existingVoiceActorIndex, 1);
  
      // Remove o ID do personagem da lista dubCharacters do dublador
      const characterIndex = voiceActor.dubCharacters.indexOf(character._id);
      if (characterIndex !== -1) {
        voiceActor.dubCharacters.splice(characterIndex, 1);
        await voiceActor.save(); // Salva o dublador atualizado
      }
  
      await manga.save(); // Salva o manga com o dublador removido do personagem
  
      res.json({
        message: "Dublador removido do personagem com sucesso",
        character,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Erro no servidor");
    }
  };
