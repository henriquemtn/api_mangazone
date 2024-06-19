const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação ausente, acesso negado' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'jwtSecret');
    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;
