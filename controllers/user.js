const Users = require('../models/user');

module.exports.getUserInfo = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }));
};
