const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      "code": 401,
      "error": "Please authenticate.",
      "message": "Authentication failed. Either the token is missing, invalid, or the user does not exist."
    });
  }
};

module.exports = authenticate;