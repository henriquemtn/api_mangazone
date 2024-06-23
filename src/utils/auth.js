const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const secret = process.env.JWT_SECRET_KEY; 
    return jwt.sign({ id: user._id, username: user.username }, secret, { expiresIn: '8h' });
};

const verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET_KEY;
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};