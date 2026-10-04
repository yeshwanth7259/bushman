const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  weight: { type: String }
});

const addressSchema = new mongoose.Schema({
  label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true }, // e.g., BM10284
  wooCommerceOrderId: { type: Number }, // Link to WC
  items: [orderItemSchema],
  deliveryAddress: addressSchema,
  status: {
    type: String,
    enum: ['CONFIRMED', 'PROCESSING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'CONFIRMED'
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'ONLINE'],
    default: 'COD'
  },
  totalAmount: { type: Number, required: true },
  deliveryCharges: { type: Number, default: 40 },
  discount: { type: Number, default: 0 },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // For V2
}, { timestamps: true });

// GeoJSON Index for location tracking
orderSchema.index({ "deliveryAddress.location": "2dsphere" });

module.exports = mongoose.model('Order', orderSchema);
