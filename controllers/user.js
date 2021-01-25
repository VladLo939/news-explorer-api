const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/badRequestError');
const AuthError = require('../errors/authError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res) => {
  User.findById(req.user)
    .then((user) => res.json({ name: user.name, email: user.email }));
};

module.exports.createUser = (req, res, next) => {
  const patten = new RegExp(/[A-Za-z0-9]{8,}/);
  const {
    name, email, password,
  } = req.body;

  if (!patten.test(password)) {
    throw new BadRequestError('Invalid password');
  } else if (!password) {
    throw new BadRequestError('Password is required');
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.json({
      _id: user._id, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${err}`));
      } else if (err.name === 'MongoError' || err.code === 11000) {
        next(new ConflictError('Такой Email уже существует'));
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      res.send({ token });
    })
    .catch(() => {
      throw new AuthError('Ошибка авторизации');
    })
    .catch(next);
};
