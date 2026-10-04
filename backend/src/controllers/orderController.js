const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const initWooCommerce = require('../config/wooCommerce');

const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const cart = await Cart.findOne({ user: user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // 1. Create WooCommerce Order (so WooCommerce is the source of truth)
    const api = initWooCommerce();
    const wcData = {
      payment_method: paymentMethod === 'COD' ? 'cod' : 'bacs',
      payment_method_title: paymentMethod === 'COD' ? 'Cash on Delivery' : 'Direct Bank Transfer',
      set_paid: false,
      billing: {
        first_name: user.name || 'Customer',
        phone: user.phone,
        address_1: deliveryAddress.addressLine1,
        city: deliveryAddress.city,
        postcode: deliveryAddress.pincode
      },
      line_items: cart.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity
      }))
    };

    let wooCommerceOrderId = null;
    try {
      const response = await api.post('orders', wcData);
      wooCommerceOrderId = response.data.id;
    } catch (wcError) {
      console.error('WooCommerce Order Error:', wcError.response?.data || wcError.message);
      // In production, we'd halt, but for robustness we might continue or return error
      return res.status(500).json({ success: false, message: 'Failed to create WooCommerce order.' });
    }

    // 2. Create MongoDB Order
    const orderNumber = \`BM\${Math.floor(Math.random() * 90000) + 10000}\`; // e.g. BM10284
    
    const deliveryCharges = 40;
    const discount = 0;
    const totalAmount = cart.totalAmount + deliveryCharges - discount;

    const order = await Order.create({
      user: user._id,
      orderNumber,
      wooCommerceOrderId,
      items: cart.items,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      deliveryCharges,
      discount,
      status: 'CONFIRMED'
    });

    // 3. Clear Cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getOrders };
