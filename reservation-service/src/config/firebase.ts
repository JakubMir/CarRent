import * as admin from 'firebase-admin';

var serviceAccount = require('./wab24-53dd0-firebase-adminsdk-jjupk-08fb2734d5.json');

// Inicializujte Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const firestore = admin.firestore();
export const auth = admin.auth();
export default admin;
