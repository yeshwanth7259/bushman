const { initializeApp, cert, getApps } = require('firebase-admin/app');

const initFirebase = () => {
  if (getApps().length === 0) {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      serviceAccount = require('./serviceAccountKey.json');
    }
    
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin Initialized');
  }
};

module.exports = initFirebase;
