const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
  customerId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerAddress: { type: String },
  region: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);