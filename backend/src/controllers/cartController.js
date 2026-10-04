const Cart = require('../models/Cart');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.uid }); // Wait, user is objectId in Cart, but req.user has uid?
    // We should use the MongoDB ObjectId for the user. We need to attach it in the auth middleware or fetch it here.
    // For now, let's just find by a generic user ID or use the firebaseUid by modifying the schema.
    // Let's modify the schema to use firebaseUid as string to make it easier, or fetch user first.
    // Actually, in authController, we create User. Let's just fetch User.
    const User = require('../models/User');
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let cartDoc = await Cart.findOne({ user: user._id });
    if (!cartDoc) {
      cartDoc = await Cart.create({ user: user._id, items: [], totalAmount: 0 });
    }
    res.json({ success: true, cart: cartDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { productId, name, price, quantity, weight, image } = req.body;
    const User = require('../models/User');
    const user = await User.findOne({ firebaseUid: req.user.uid });

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [], totalAmount: 0 });
    }

    const existingItem = cart.items.find(item => item.productId === productId && item.weight === weight);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity, weight, image });
    }

    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addItemToCart };
