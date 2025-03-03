const mongoose = require("mongoose");
require("dotenv").config(); // Ensure .env is loaded

const connectDatabase = () => {
    mongoose
        .connect(process.env.URI)
        .then(() => console.log("Database connected"))
        .catch((err) => {
            console.log("Database connection error:", err);
            process.exit(1);
        });
};

module.exports = connectDatabase;