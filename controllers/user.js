const User = require('../models/user');

module.exports.getUserInfo = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }));
};
