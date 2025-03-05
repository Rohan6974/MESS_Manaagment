const mongoose = require('mongoose');

const DeanAndHODSchema = new mongoose.Schema({ 
    name: String,
    email: String, 
    password: String,
    role:{type: String, default: "DeanAndHOD"},
    confirmPassword: String,
    UID:String, 
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DeanAndHOD', DeanAndHODSchema);    