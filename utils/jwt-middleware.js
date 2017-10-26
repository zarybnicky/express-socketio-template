const jwtMiddleware = require('digipolis-api').middleware;

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  return jwtMiddleware(req, res, next);
};
