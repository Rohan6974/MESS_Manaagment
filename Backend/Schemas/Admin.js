const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
});

module.exports = mongoose.model("Admin", AdminSchema);