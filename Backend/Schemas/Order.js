const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: false },
    facultyName: { type: String, required: false },
    mealCategory: { type: String, enum: ["breakfast", "lunch", "dinner"], required: false },
    orderDate: { type: Date, default: Date.now },
    tokenId: { type: String, required: false, unique: true },
    qrCode: { type: String, required: true }
});

module.exports = mongoose.model("Order", orderSchema);