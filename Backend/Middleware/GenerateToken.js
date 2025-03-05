const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (id, role) => {
    return jwt.sign({id,role},process.env.JWT_SECRET, { expiresIn: '1h' });
}   

module.exports = generateToken