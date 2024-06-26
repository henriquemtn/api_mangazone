const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Controlador para registrar um novo usuário
exports.register = async (req, res) => {
  const { email, password, username, displayName } = req.body;

  try {
    // Verifica se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Cria um novo usuário
    user = new User({ email, password, username, displayName });

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Salva o usuário no banco de dados
    await user.save();

    // Gera um token JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      // Retorna o token JWT e os dados do usuário
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          biography: user.biography,
          photoURL: user.photoURL,
          location: user.location,
          favorites: user.favorites,
          characters: user.characters,
          people: user.people,
          comments: user.comments,
          friends: user.friends,
          wishlist: user.wishlist,
          role: user.role
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Controlador para fazer login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Gera um token JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {  // Inclui os dados do usuário no retorno da resposta
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          biography: user.biography,
          photoURL: user.photoURL,
          location: user.location,
          favorites: user.favorites,
          characters: user.characters,
          people: user.people,
          comments: user.comments,
          friends: user.friends,
          wishlist: user.wishlist,
          role: user.role
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Deletar um usuário
exports.deleteUser = async (req, res) => {
  const userId = req.user.id; // Obtém o ID do usuário autenticado (via token JWT)

  try {
    // Encontra e remove o usuário pelo ID
    await User.findByIdAndRemove(userId);

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao deletar usuário');
  }
};

// Atualizar informações do usuário
exports.updateUser = async (req, res) => {
  const userId = req.user.id; // Obtém o ID do usuário autenticado (via token JWT)
  const { username, displayName, biography, gender, photoURL, location } = req.body;

  try {
    // Verifica se o usuário existe
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualiza as informações do usuário
    user.username = username;
    user.displayName = displayName;
    user.biography = biography;
    user.gender = gender;
    user.photoURL = photoURL;
    user.location = location;

    // Salva as alterações no banco de dados
    await user.save();

    res.json({ message: 'Informações do usuário atualizadas com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao atualizar informações do usuário');
  }
};

// Adicionar um mangá à mangaCollection
exports.addToMangaCollection = async (req, res) => {
  const userId = req.user.id; // Obtém o ID do usuário autenticado (via token JWT)
  const { mangaId } = req.body; // Recebe mangaId do corpo da requisição

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se o mangá já está na coleção do usuário
    const existingManga = user.mangaCollection.find(item => item.mangaId.equals(mangaId));
    if (existingManga) {
      return res.status(400).json({ message: 'Este mangá já está na sua coleção' });
    }

    // Adiciona o mangá à mangaCollection do usuário
    user.mangaCollection.push({ mangaId });
    await user.save();

    res.json({ message: 'Mangá adicionado à coleção com sucesso', mangaId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao adicionar mangá à coleção');
  }
};

// Adicionar volumes a um mangá na mangaCollection
exports.addVolumeToManga = async (req, res) => {
  const userId = req.user.id; // Obtém o ID do usuário autenticado (via token JWT)
  const { mangaId, volumeId } = req.body; // Recebe mangaId e volumeId do corpo da requisição

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Encontra o mangá na mangaCollection do usuário
    const manga = user.mangaCollection.find(item => item.mangaId.equals(mangaId));
    if (!manga) {
      return res.status(404).json({ message: 'Mangá não encontrado na coleção do usuário' });
    }

    // Inicializa volumes como um array vazio, se for undefined
    if (!manga.volumes) {
      manga.volumes = [];
    }

    // Verifica se o volume já está presente no mangá
    if (manga.volumes.includes(volumeId)) {
      return res.status(400).json({ message: 'Este volume já está associado ao mangá' });
    }

    // Adiciona o volume ao mangá na mangaCollection
    manga.volumes.push(volumeId);
    await user.save();

    res.json({ message: 'Volume adicionado ao mangá com sucesso', mangaId, volumeId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao adicionar volume ao mangá');
  }
};

// Obter mangaCollection pelo username
exports.getMangaCollection = async (req, res) => {
  const username = req.params.username; // Obtém o ID do usuário a partir dos parâmetros da URL

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Retorna a mangaCollection do usuário
    res.json({ mangaCollection: user.mangaCollection });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao buscar mangaCollection do usuário');
  }
};

// Verificar se o mangá está na coleção do usuário pelo username
exports.checkMangaInCollection = async (req, res) => {
  const username = req.params.username; // Obtém o username do usuário na URL
  const mangaId = req.params.mangaId; // Obtém o ID do mangá a ser verificado na coleção

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const manga = user.mangaCollection.find(m => m.mangaId.toString() === mangaId);
    if (manga) {
      return res.json(true); // Mangá está na coleção do usuário
    } else {
      return res.json(false); // Mangá não está na coleção do usuário
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao verificar mangá na coleção do usuário');
  }
};



// Deletar mangá da mangaCollection de um usuário
exports.deleteMangaFromCollection = async (req, res) => {
  const userId = req.user.id; // Obtém o ID do usuário autenticado (via token JWT)
  const { mangaId } = req.params; // Obtém o ID do mangá a ser deletado dos parâmetros da URL

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Encontra o índice do mangá na mangaCollection do usuário
    const index = user.mangaCollection.findIndex(item => item.mangaId.equals(mangaId));
    if (index === -1) {
      return res.status(404).json({ message: 'Mangá não encontrado na coleção do usuário' });
    }

    // Remove o mangá da mangaCollection
    user.mangaCollection.splice(index, 1);
    await user.save();

    res.json({ message: 'Mangá removido da coleção com sucesso', mangaId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao remover mangá da coleção');
  }
};

// Remover volumes de um mangá na mangaCollection de um usuário
exports.removeVolumesFromManga = async (req, res) => {
  const userId = req.user.id; // Obtém o ID do usuário autenticado (via token JWT)
  const { mangaId, volumeId } = req.body; // Recebe mangaId e volumeIds do corpo da requisição

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Encontra o mangá na mangaCollection do usuário
    const manga = user.mangaCollection.find(item => item.mangaId.equals(mangaId));
    if (!manga) {
      return res.status(404).json({ message: 'Mangá não encontrado na coleção do usuário' });
    }

    // Remove os volumeIds do mangá na mangaCollection
    manga.volumes = manga.volumes.filter(vol => !volumeId.includes(vol.toString())); // Converte para string para comparação
    await user.save();

    res.json({ message: 'Volumes removidos do mangá com sucesso', mangaId, volumeId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao remover volumes do mangá');
  }
};

// Obter usuário pelo username
exports.getUserByUsername = async (req, res) => {
  const { username } = req.params; // Obtém o username dos parâmetros da URL

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Retorna os dados do usuário
    res.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      biography: user.biography,
      photoURL: user.photoURL,
      location: user.location,
      favorites: user.favorites,
      characters: user.characters,
      people: user.people,
      comments: user.comments,
      friends: user.friends,
      wishlist: user.wishlist,
      role: user.role
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao buscar usuário');
  }
};
