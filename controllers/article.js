const Article = require('../models/article');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbidden');

module.exports.getArticle = (req, res) => {
  Article.find({ owner: req.user._id })
    .then((article) => res.send({ data: article }));
};

module.exports.addArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((articles) => res.json({ data: articles }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Неверные данные');
      }
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId).populate('owner')
    .orFail(() => new Error('Not found'))
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        card.remove();
        res.send(card);
      } else next(new ForbiddenError('Попытка удалить чужую карточку'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else if (err.message === 'Not found') {
        next(new NotFoundError('Объект не найден'));
      }
    })
    .catch(next);
};
