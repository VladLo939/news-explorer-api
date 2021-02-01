require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { limiter } = require('./middleware/ratelimiter');
const userRouter = require('./routes/user');
const articleRouter = require('./routes/article');
const { createUser, login } = require('./controllers/user');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorhander');
const { notFound } = require('./controllers/notFound');

const { PORT = 3000, NODE_ENV, BASE_URL } = process.env;
const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? BASE_URL : 'mongodb://localhost:27017/newsapi', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(limiter);

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
app.use(notFound);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {

});
