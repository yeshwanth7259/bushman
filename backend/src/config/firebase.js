const { initializeApp, cert, getApps } = require('firebase-admin/app');
const serviceAccount = require('./serviceAccountKey.json');

const initFirebase = () => {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin Initialized');
  }
};

module.exports = initFirebase;
