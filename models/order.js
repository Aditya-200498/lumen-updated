const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  orderId: { type: Number, required: true, unique: true },
  productId: { type: String, required: true, ref: 'Product' },
  customerId: { type: String, required: true, ref: 'Customer' },
  dateOfSale: { type: Date, required: true },
  quantitySold: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  discount: { type: Number },
  shippingCost: { type: Number },
  paymentMethod: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);