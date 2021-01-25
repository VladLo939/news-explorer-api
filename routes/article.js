const articleRouter = require('express').Router();
const { addArticle, getArticle, deleteArticle } = require('../controllers/article');

articleRouter.get('/', getArticle);
articleRouter.post('/', addArticle);
articleRouter.delete('/:articleId', deleteArticle);

module.exports = articleRouter;
