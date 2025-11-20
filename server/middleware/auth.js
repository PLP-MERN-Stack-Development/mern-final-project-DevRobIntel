// server/middleware/auth.js
import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded; // { id: user._id }
    next();
  } catch (err) {
    console.error('Token error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};