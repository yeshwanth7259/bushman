const User = require('../models/User');

const syncUser = async (req, res) => {
  try {
    const { uid, phone_number } = req.user;
    
    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        phone: phone_number || '', // phone comes from Firebase token
      });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ success: false, message: 'Server error during sync.' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
};

module.exports = { syncUser, getMe };
