import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '_default_secret'; 
const JWT_EXPIRES_IN = '24h'; // or '10d', '1h', etc.

const jwtService = {
  /**
   * Generates a JWT token
   * @param {Object} payload - Data to encode in the token
   * @returns {string} token
   */
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  /**
   * Verifies a JWT token
   * @param {string} token - JWT to verify
   * @returns {Object} decoded payload
   * @throws if invalid or expired
   */
  verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  },

  /**
   * Decode token without verifying signature
   * @param {string} token 
   * @returns {Object} decoded payload
   */
  decodeToken(token) {
    return jwt.decode(token);
  }
};

export default jwtService;