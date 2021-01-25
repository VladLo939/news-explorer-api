const express = require('express');
const mongoose = require('mongoose');
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

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', userRouter);
app.use('/articles', articleRouter);

app.use(errorHandler);

app.listen(PORT, () => {
});
