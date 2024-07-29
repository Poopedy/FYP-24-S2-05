const jwt = require('jsonwebtoken');
const secret = 'fyp_jwt';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the Authorization header
  
    if (!token) {
      return res.status(403).send({ message: 'No token provided.' });
    }
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({ message: 'Failed to authenticate token.' });
      }
  
      // Save user ID to request for use in other routes
      req.userId = decoded.id;
      next();
    });
  };
  
  module.exports = verifyToken;

  // const verifyToken = require('../middlewares/authMiddleware');