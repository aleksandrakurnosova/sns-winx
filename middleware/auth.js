import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/keys.js';

export const auth = (req, res, next) => {

  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  // Check if not token
  if (!token)
    return res.status(401).json({ Error: 'No token, authorization denied' });

  // Verify token
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ Error: 'Token is not valid' });
    } else {
      
      req.userId = decoded.userId;
      next();
    }
  });
};

export default auth;
