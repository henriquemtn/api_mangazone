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

    jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
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

    jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {  // Inclui os dados do usuário no retorno da resposta
          id: user.id,
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