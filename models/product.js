const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);