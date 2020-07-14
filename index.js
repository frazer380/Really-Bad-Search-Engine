const admin = require('firebase-admim');

admin.initializeApp();

const db = admin.firestore();

let sites = db.collection('sites');

console.log(sites)