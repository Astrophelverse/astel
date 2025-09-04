// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Firebase errors
  if (err.code === 'auth/user-not-found') {
    error = {
      message: 'User not found',
      status: 404
    };
  } else if (err.code === 'auth/invalid-credential') {
    error = {
      message: 'Invalid credentials',
      status: 401
    };
  } else if (err.code === 'auth/email-already-in-use') {
    error = {
      message: 'Email already in use',
      status: 409
    };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation failed',
      status: 400,
      details: err.details
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401
    };
  } else if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    error = {
      message: 'Too many requests',
      status: 429
    };
  }

  // Send error response
  res.status(error.status).json({
    error: {
      message: error.message,
      status: error.status,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      ...(error.details && { details: error.details })
    }
  });
};

module.exports = { errorHandler };
