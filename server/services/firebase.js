const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service-account.json');

let db;
let storage;
let auth;

const initializeFirebase = () => {
  try {
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'astel-marketplace.appspot.com',
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });

    // Initialize services
    db = admin.firestore();
    storage = admin.storage();
    auth = admin.auth();

    console.log('✅ Firebase Admin SDK initialized successfully');
    
    // Test database connection
    db.collection('test').doc('connection').get()
      .then(() => console.log('✅ Firestore connection successful'))
      .catch(err => console.error('❌ Firestore connection failed:', err));

  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    process.exit(1);
  }
};

const getFirestore = () => {
  if (!db) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return db;
};

const getStorage = () => {
  if (!storage) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return storage;
};

const getAuth = () => {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
};

// Helper function to create a new document with auto-generated ID
const createDocument = async (collection, data) => {
  const docRef = await db.collection(collection).add({
    ...data,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  });
  return docRef.id;
};

// Helper function to update a document
const updateDocument = async (collection, docId, data) => {
  await db.collection(collection).doc(docId).update({
    ...data,
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  });
  return docId;
};

// Helper function to delete a document
const deleteDocument = async (collection, docId) => {
  await db.collection(collection).doc(docId).delete();
  return docId;
};

// Helper function to get a document by ID
const getDocument = async (collection, docId) => {
  const doc = await db.collection(collection).doc(docId).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

// Helper function to query documents
const queryDocuments = async (collection, conditions = [], orderBy = null, limit = null) => {
  let query = db.collection(collection);
  
  // Apply conditions
  conditions.forEach(condition => {
    query = query.where(condition.field, condition.operator, condition.value);
  });
  
  // Apply ordering
  if (orderBy) {
    query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
  }
  
  // Apply limit
  if (limit) {
    query = query.limit(limit);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Helper function to check if user exists
const userExists = async (userId) => {
  try {
    const userRecord = await auth.getUser(userId);
    return !!userRecord;
  } catch (error) {
    return false;
  }
};

// Helper function to get user custom claims
const getUserClaims = async (userId) => {
  try {
    const userRecord = await auth.getUser(userId);
    return userRecord.customClaims || {};
  } catch (error) {
    return {};
  }
};

// Helper function to set user custom claims
const setUserClaims = async (userId, claims) => {
  try {
    await auth.setCustomUserClaims(userId, claims);
    return true;
  } catch (error) {
    console.error('Error setting user claims:', error);
    return false;
  }
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getStorage,
  getAuth,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  queryDocuments,
  userExists,
  getUserClaims,
  setUserClaims
};
