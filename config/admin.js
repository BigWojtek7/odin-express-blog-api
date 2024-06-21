const { jwtDecode }  = require('jwt-decode')

exports.isAdmin = (req, res, next) => {
  const isAdmin = jwtDecode(req.headers.authorization).admin;
  if (!isAdmin) {
    return res.status(401).send('Access denied. Not an admin');
  }
  next();
};
