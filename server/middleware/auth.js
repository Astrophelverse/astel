const { getAuth } = require('../services/firebase');

// Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }

    try {
      // Verify the Firebase ID token
      const decodedToken = await getAuth().verifyIdToken(token);
      
      // Add user info to request object
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        customClaims: decodedToken.custom_claims || {}
      };

      // Check if user is banned or suspended
      if (req.user.customClaims.banned) {
        return res.status(403).json({
          error: 'Account suspended',
          message: 'Your account has been suspended. Please contact support.'
        });
      }

      next();
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return res.status(403).json({
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    });
  }
};

// Middleware to check if user is a seller
const requireSeller = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    // Get user profile from database to check account type
    const { getDocument } = require('../services/firebase');
    const userProfile = await getDocument('users', req.user.uid);

    if (!userProfile) {
      return res.status(404).json({
        error: 'User profile not found',
        message: 'User profile does not exist'
      });
    }

    if (userProfile.account_type !== 'seller') {
      return res.status(403).json({
        error: 'Seller access required',
        message: 'This feature is only available to sellers'
      });
    }

    // Add user profile to request
    req.userProfile = userProfile;
    next();
  } catch (error) {
    console.error('Seller verification error:', error);
    return res.status(500).json({
      error: 'Verification failed',
      message: 'An error occurred while verifying seller status'
    });
  }
};

// Middleware to check if user is verified seller
const requireVerifiedSeller = async (req, res, next) => {
  try {
    if (!req.userProfile) {
      return res.status(400).json({
        error: 'Seller verification required',
        message: 'Please verify your seller account first'
      });
    }

    if (!req.userProfile.verification?.verified_seller) {
      return res.status(403).json({
        error: 'Verified seller required',
        message: 'This feature requires a verified seller account'
      });
    }

    next();
  } catch (error) {
    console.error('Verified seller check error:', error);
    return res.status(500).json({
      error: 'Verification check failed',
      message: 'An error occurred while checking verification status'
    });
  }
};

// Middleware to check if user has premium subscription
const requirePremium = async (req, res, next) => {
  try {
    if (!req.userProfile) {
      return res.status(400).json({
        error: 'User profile required',
        message: 'User profile not found'
      });
    }

    if (!req.userProfile.subscription?.astel_plus) {
      return res.status(403).json({
        error: 'Premium subscription required',
        message: 'This feature requires an Astel+ subscription'
      });
    }

    // Check if subscription is expired
    const now = new Date();
    const expiryDate = new Date(req.userProfile.subscription.expiry_date);
    
    if (now > expiryDate) {
      return res.status(403).json({
        error: 'Subscription expired',
        message: 'Your Astel+ subscription has expired. Please renew to continue.'
      });
    }

    next();
  } catch (error) {
    console.error('Premium check error:', error);
    return res.status(500).json({
      error: 'Premium verification failed',
      message: 'An error occurred while checking premium status'
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    if (!req.user.customClaims.admin) {
      return res.status(403).json({
        error: 'Admin access required',
        message: 'This feature is only available to administrators'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      error: 'Admin verification failed',
      message: 'An error occurred while checking admin status'
    });
  }
};

// Middleware to check if user owns the resource
const requireOwnership = (resourceField = 'author_id') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'Please log in to access this resource'
        });
      }

      // Check if the resource belongs to the user
      if (req.body[resourceField] && req.body[resourceField] !== req.user.uid) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You can only modify your own resources'
        });
      }

      // For existing resources, check the resource data
      if (req.params.id && req.resource && req.resource[resourceField] !== req.user.uid) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You can only modify your own resources'
        });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        error: 'Ownership verification failed',
        message: 'An error occurred while checking resource ownership'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireSeller,
  requireVerifiedSeller,
  requirePremium,
  requireAdmin,
  requireOwnership
};
