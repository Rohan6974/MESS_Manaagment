const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Students = new Schema({ 
    name: String,
    email: String,
    password: String,
    role: { type: String, default: 'student' },
    UID: String,
    qr: String,
});

module.exports = mongoose.model('Students', Students);
