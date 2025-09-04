const express = require('express');
const { body, validationResult } = require('express-validator');
const { getAuth, createDocument, getDocument, updateDocument } = require('../services/firebase');
const { generateJWT } = require('../utils/jwt');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('display_name').trim().isLength({ min: 2, max: 50 }),
  body('date_of_birth').isISO8601(),
  body('shop_name').optional().trim().isLength({ max: 100 }),
  body('address.city').trim().isLength({ min: 2, max: 50 }),
  body('address.area').trim().isLength({ min: 2, max: 100 }),
  body('bio').optional().trim().isLength({ max: 500 })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Register new user
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, display_name, date_of_birth, shop_name, address, bio } = req.body;

    // Create Firebase auth user
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: display_name,
      emailVerified: false
    });

    // Create user profile
    const userProfile = {
      uid: userRecord.uid,
      email,
      display_name,
      account_type: shop_name ? 'seller' : 'buyer',
      profile_picture: '',
      date_of_birth,
      shop_name: shop_name || '',
      address,
      bio: bio || '',
      verification: { cac_verified: false, bvn_verified: false, verified_seller: false },
      badges: {},
      stats: { followers_count: 0, following_count: 0, posts_count: 0, sold_count: 0, rating: 0 },
      online_status: { is_online: true, last_seen: new Date(), last_activity: new Date() },
      subscription: { astel_plus: false }
    };

    await createDocument('users', userProfile);
    const token = await generateJWT(userRecord.uid);

    res.status(201).json({
      message: 'User registered successfully',
      user: { uid: userRecord.uid, email, display_name, account_type: userProfile.account_type },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

// Login user
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await getAuth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const userProfile = await getDocument('users', user.uid);
    if (!userProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    await updateDocument('users', user.uid, {
      'online_status.is_online': true,
      'online_status.last_seen': new Date(),
      'online_status.last_activity': new Date()
    });

    const token = await generateJWT(user.uid);
    res.json({
      message: 'Login successful',
      user: { uid: user.uid, email, display_name: userProfile.display_name, account_type: userProfile.account_type },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google sign-in
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await getAuth().verifyIdToken(idToken);
    
    let userRecord;
    try {
      userRecord = await getAuth().getUser(decodedToken.uid);
    } catch (error) {
      userRecord = await getAuth().createUser({
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || decodedToken.email.split('@')[0],
        emailVerified: decodedToken.email_verified
      });

      const userProfile = {
        uid: userRecord.uid,
        email: decodedToken.email,
        display_name: decodedToken.name || decodedToken.email.split('@')[0],
        account_type: 'buyer',
        profile_picture: decodedToken.picture || '',
        verification: { cac_verified: false, bvn_verified: false, verified_seller: false },
        badges: {},
        stats: { followers_count: 0, following_count: 0, posts_count: 0, sold_count: 0, rating: 0 },
        online_status: { is_online: true, last_seen: new Date(), last_activity: new Date() },
        subscription: { astel_plus: false }
      };

      await createDocument('users', userProfile);
    }

    const token = await generateJWT(userRecord.uid);
    res.json({ message: 'Google sign-in successful', token });

  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(500).json({ error: 'Google sign-in failed' });
  }
});

// Guest access
router.post('/guest', async (req, res) => {
  try {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const guestProfile = {
      uid: guestId,
      display_name: 'Guest User',
      account_type: 'guest',
      is_guest: true,
      online_status: { is_online: true, last_seen: new Date(), last_activity: new Date() }
    };

    await createDocument('users', guestProfile);
    const token = await generateJWT(guestId);

    res.json({
      message: 'Guest access granted',
      user: { uid: guestId, display_name: 'Guest User', account_type: 'guest', is_guest: true },
      token
    });

  } catch (error) {
    console.error('Guest access error:', error);
    res.status(500).json({ error: 'Guest access failed' });
  }
});

module.exports = router;
