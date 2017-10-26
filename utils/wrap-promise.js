module.exports = (req, res, next) => (f) => {
  new Promise(f(res)).then(res.json).catch(next);
};
