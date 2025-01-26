const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  console.log('Middleware token value:', token);

  if (!token) {
    return res.status(401).send({ message: 'Invalid access' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
    if (error) {
      console.log(error);
      return res.status(401).send({ message: 'Unauthorized access' });
    }
    console.log('Token value:', decoded);
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
