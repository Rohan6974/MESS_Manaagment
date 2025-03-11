const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Waste', wasteSchema);
