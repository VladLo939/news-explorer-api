const NotFoundError = require('../errors/notFoundError');

module.exports.notFound = () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
};
