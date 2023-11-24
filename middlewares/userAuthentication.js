const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have an Admin model

async function isUser(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
  
    try {
      const decoded = jwt.verify(token, 'your-secret-key');
  
      // Check if the user is an admin
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(403).json({ message: 'Admin access denied' });
      }
  
      // Attach the admin's ID to the request object for future use
      req.userId = user._id;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }

module.exports = isUser;