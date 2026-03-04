const jwt = require("jsonwebtoken");
const { config } = require("../config");

/**
 * Generate JWT Token
 * @param {string} id - User ID to encode
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire || "30d",
  });
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

/**
 * Get secure cookie options for JWT
 * @returns {object} Cookie options
 */
const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: config.cookie.maxAge,
    ...(config.cookie.domain && { domain: config.cookie.domain }),
  };
};

/**
 * Set JWT cookie on response
 * @param {object} res - Express response object
 * @param {string} token - JWT token
 */
const setTokenCookie = (res, token) => {
  res.cookie("token", token, getCookieOptions());
};

/**
 * Clear JWT cookie
 * @param {object} res - Express response object
 */
const clearTokenCookie = (res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    expires: new Date(0),
    ...(config.cookie.domain && { domain: config.cookie.domain }),
  });
};

module.exports = {
  generateToken,
  verifyToken,
  getCookieOptions,
  setTokenCookie,
  clearTokenCookie,
};
