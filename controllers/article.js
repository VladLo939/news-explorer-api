const Article = require('../models/article');

module.exports.getArticle = (req, res) => {
  Article.find({})
    .then((article) => res.send({ data: article }));
};
