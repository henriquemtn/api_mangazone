const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Manga = require("../models/manga");

// Obter todos os mangás
router.get("/mangas", async (req, res) => {
  try {
    const mangas = await Manga.find();
    res.json(mangas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para buscar mangás por nome
router.get("/mangas/search", async (req, res) => {
  const name = req.query.name;

  try {
    const mangas = await Manga.find({
      title: { $regex: new RegExp(name, "i") },
    });
    res.json(mangas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter um mangá específico
router.get("/mangas/:id", getManga, (req, res) => {
  res.json(res.manga);
});

// Criar um novo mangá
router.post("/mangas", async (req, res) => {
  console.log(req.body); // Adicione esta linha para depuração
  const manga = new Manga({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    publishedYear: req.body.publishedYear,
    price: req.body.price,
    volumes: req.body.volumes || [], // Inicializar com volumes se fornecido
    imageUrl: req.body.imageUrl, // Adicionando o campo imageUrl
  });

  try {
    const newManga = await manga.save();
    res.status(201).json(newManga);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar um mangá
router.patch("/mangas/:id", getManga, async (req, res) => {
  if (req.body.title != null) {
    res.manga.title = req.body.title;
  }
  if (req.body.author != null) {
    res.manga.author = req.body.author;
  }
  if (req.body.genre != null) {
    res.manga.genre = req.body.genre;
  }
  if (req.body.publishedYear != null) {
    res.manga.publishedYear = req.body.publishedYear;
  }
  if (req.body.volumes != null) {
    res.manga.volumes = req.body.volumes;
  }
  if (req.body.imageUrl != null) {
    res.manga.imageUrl = req.body.imageUrl; // Atualizando o campo imageUrl
  }

  try {
    const updatedManga = await res.manga.save();
    res.json(updatedManga);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Excluir um mangá
router.delete("/mangas/:id", getManga, async (req, res) => {
  try {
    await res.manga.deleteOne();
    res.json({ message: "Mangá removido" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obter volumes de um mangá específico
router.get("/mangas/:id/volumes", async (req, res) => {
  try {
    // Encontre o mangá pelo ID fornecido na solicitação
    const manga = await Manga.findById(req.params.id);

    // Verifique se o mangá existe
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    // Se o mangá existir, retorne apenas os volumes associados a ele
    res.json(manga.volumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Adicionar um volume a um mangá específico
router.post("/mangas/:id/volumes", getManga, async (req, res) => {
  const volumeNumber = req.body.volumeNumber;
  const releaseDate = req.body.releaseDate;
  const chapters = req.body.chapters;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const link = req.body.link;

  // Obtenha o mangá do objeto de resposta
  const manga = res.manga;

  // Construa o nome do volume automaticamente se ainda não tiver um
  let volumeName = req.body.volumeName;
  if (!volumeName) {
    volumeName = `${manga.title} ${volumeNumber}`;
  }

  // Crie o objeto de volume
  const volume = {
    volumeName: volumeName,
    volumeNumber: volumeNumber,
    releaseDate: releaseDate,
    chapters: chapters,
    link: link,
    price: price,
    imageUrl: imageUrl,
  };

  manga.volumes.push(volume);

  try {
    const updatedManga = await manga.save();
    res.status(201).json(updatedManga);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Modificar um volume de um mangá específico
router.put("/mangas/:mangaId/volumes/:volumeId", async (req, res) => {
  const mangaId = req.params.mangaId;
  const volumeId = req.params.volumeId;

  const { volumeNumber, releaseDate, chapters, imageUrl, price, link } = req.body;

  try {
    // Encontre o mangá pelo ID
    const manga = await Manga.findById(mangaId);

    // Verifique se o mangá existe
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    // Encontre o volume pelo ID dentro do array de volumes do mangá
    const volumeToUpdate = manga.volumes.find(volume => volume._id == volumeId);

    // Verifique se o volume existe
    if (!volumeToUpdate) {
      return res.status(404).json({ message: "Volume não encontrado" });
    }

    // Atualize os campos do volume com os novos valores
    volumeToUpdate.volumeNumber = volumeNumber;
    volumeToUpdate.releaseDate = releaseDate;
    volumeToUpdate.chapters = chapters;
    volumeToUpdate.imageUrl = imageUrl;
    volumeToUpdate.price = price;
    volumeToUpdate.link = link;

    // Salve as alterações no mangá
    await manga.save();

    // Retorne o volume atualizado como resposta (opcional)
    res.status(200).json(volumeToUpdate);
  } catch (err) {
    // Se ocorrer um erro, retorne uma resposta de erro
    res.status(500).json({ message: err.message });
  }
});


// Excluir um volume de um mangá específico
router.delete("/mangas/:mangaId/volumes/:volumeId", async (req, res) => {
  const mangaId = req.params.mangaId;
  const volumeId = req.params.volumeId;

  try {
    // Encontre o mangá pelo ID
    const manga = await Manga.findById(mangaId);

    // Verifique se o mangá existe
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }

    // Encontre o índice do volume no array de volumes do mangá
    const volumeIndex = manga.volumes.findIndex(
      (volume) => volume._id == volumeId
    );

    // Verifique se o volume existe
    if (volumeIndex === -1) {
      return res.status(404).json({ message: "Volume não encontrado" });
    }

    // Remova o volume do array de volumes do mangá
    manga.volumes.splice(volumeIndex, 1);

    // Salve as alterações no mangá
    await manga.save();

    // Retorne uma resposta de sucesso
    res.status(200).json({ message: "Volume excluído com sucesso" });
  } catch (err) {
    // Se ocorrer um erro, retorne uma resposta de erro
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obter um mangá por ID
async function getManga(req, res, next) {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado" });
    }
    res.manga = manga; // Armazenando o documento do MongoDB em res.manga
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Adicionar mangaCollection para um usuário específico
router.post("/users/:firebaseId/mangasCollections", async (req, res) => {
  const { mangaId, volumes } = req.body;
  const firebaseId = req.params.firebaseId;

  try {
    // Verifique se o usuário existe pelo firebaseId
    let user = await User.findOne({ _id: firebaseId });

    // Se o usuário não existir, crie um novo usuário
    if (!user) {
      user = new User({ _id: firebaseId, mangasCollections: [] });
    }

    // Crie um novo mangaCollection
    const newMangaCollection = {
      mangaId: mangaId,
      volumes: volumes || [], // Se volumes não for fornecido, inicialize como um array vazio
    };

    // Adicione o novo mangaCollection ao usuário
    user.mangasCollections.push(newMangaCollection);

    // Salve as alterações no usuário
    const updatedUser = await user.save();

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/// Adicionar volumes a um mangá específico dentro de um mangasCollections de um usuário
router.put("/users/:firebaseId/mangas/:mangaId/volumes", async (req, res) => {
  const { volumes } = req.body;
  const firebaseId = req.params.firebaseId;
  const mangaId = req.params.mangaId;

  try {
    // Encontrar o usuário pelo firebaseId
    let user = await User.findOne({ _id: firebaseId });

    // Verificar se o usuário existe
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Encontrar o manga dentro do array mangasCollections pelo mangaId
    const manga = user.mangasCollections.find((m) => m.mangaId === mangaId);

    // Verificar se o mangá existe
    if (!manga) {
      return res.status(404).json({ message: "Mangá não encontrado no mangasCollections do usuário" });
    }

    // Verificar se volumes é um array de strings
    if (!Array.isArray(volumes) || volumes.some((v) => typeof v !== "string")) {
      return res.status(400).json({ message: "Volumes deve ser um array válido contendo IDs de volumes (strings)" });
    }

    // Adicionar os volumes fornecidos ao mangá, verificando duplicatas
    const uniqueVolumes = volumes.filter(v => !manga.volumes.includes(v));
    manga.volumes.push(...uniqueVolumes);

    // Salvar as alterações no usuário
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter todos mangaCollection de um usuário específico
router.get("/users/:firebaseId/mangasCollections", async (req, res) => {
  try {
    // Verifique se o usuário existe pelo firebaseId
    const user = await User.findOne({ _id: req.params.firebaseId });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Verificar se o usuário possui coleções de mangás
    if (!user.mangasCollections || user.mangasCollections.length === 0) {
      return res
        .status(404)
        .json({
          message: "Usuário ainda não adicionou nenhum Mangá à coleção",
        });
    }

    res.json(user.mangasCollections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remover volumes de um mangá específico dentro de um mangasCollections de um usuário
router.delete(
  "/users/:firebaseId/mangas/:mangaId/volumes",
  async (req, res) => {
    const { volumes } = req.body;
    const firebaseId = req.params.firebaseId;
    const mangaId = req.params.mangaId;

    try {
      // Encontrar o usuário pelo firebaseId
      let user = await User.findOne({ _id: firebaseId });

      // Verificar se o usuário existe
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Encontrar o manga dentro do array mangasCollections pelo mangaId
      const manga = user.mangasCollections.find((m) => m.mangaId === mangaId);

      // Verificar se o mangá existe
      if (!manga) {
        return res
          .status(404)
          .json({
            message: "Mangá não encontrado no mangasCollections do usuário",
          });
      }

      // Verificar se volumes é um array de strings
      if (
        !Array.isArray(volumes) ||
        volumes.some((v) => typeof v !== "string")
      ) {
        return res
          .status(400)
          .json({
            message:
              "Volumes deve ser um array válido contendo IDs de volumes (strings)",
          });
      }

      // Filtrar e remover os volumes fornecidos do mangá
      manga.volumes = manga.volumes.filter((v) => !volumes.includes(v));

      // Salvar as alterações no usuário
      const updatedUser = await user.save();

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete("/users/:firebaseId/mangasCollections/:mangaId", async (req, res) => {
  const { firebaseId, mangaId } = req.params;

  try {
    // Encontre o usuário pelo firebaseId
    let user = await User.findOne({ _id: firebaseId });

    // Verifique se o usuário existe
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Encontre a entrada da coleção de mangás pelo mangaId
    const mangaCollectionIndex = user.mangasCollections.findIndex((m) => m.mangaId === mangaId);

    // Verifique se a coleção de mangás existe no usuário
    if (mangaCollectionIndex === -1) {
      return res.status(404).json({ message: "Mangá não encontrado no mangasCollections do usuário" });
    }

    // Remova a entrada da coleção de mangás do array do usuário
    user.mangasCollections.splice(mangaCollectionIndex, 1);

    // Salve o objeto do usuário atualizado
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
