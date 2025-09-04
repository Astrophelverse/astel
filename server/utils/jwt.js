const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'astel-super-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token for user
const generateJWT = async (userId) => {
  try {
    const payload = {
      uid: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return token;
  } catch (error) {
    console.error('JWT generation error:', error);
    throw new Error('Failed to generate JWT token');
  }
};

// Verify JWT token
const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, error: 'Token expired' };
    } else if (error.name === 'JsonWebTokenError') {
      return { valid: false, error: 'Invalid token' };
    } else {
      return { valid: false, error: 'Token verification failed' };
    }
  }
};

// Decode JWT token without verification (for debugging)
const decodeJWT = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
};

module.exports = {
  generateJWT,
  verifyJWT,
  decodeJWT,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
