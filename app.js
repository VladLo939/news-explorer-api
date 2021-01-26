const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

const userRouter = require('./routes/user');
const articleRouter = require('./routes/article');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/newsapi', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { createUser, login } = require('./controllers/user');
const auth = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorhander');

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().regex((/[0-9a-zA-Z!]{8,}/)),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().regex((/[0-9a-zA-Z!]{8,}/)),
  }),
}), login);

app.use(auth);

app.use('/users', userRouter);
app.use('/articles', articleRouter);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
});
