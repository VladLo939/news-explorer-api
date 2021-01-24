const userRouter = require('express').Router();
const { getUserInfo } = require('../controllers/user');

userRouter.get('/me', getUserInfo);

module.exports = userRouter;
