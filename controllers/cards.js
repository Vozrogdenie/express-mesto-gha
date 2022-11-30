import { constants } from 'http2';
import Card from '../model/card.js';

export function getCards(req, res, next) {
  Card.find({}).populate(['likes', 'owner'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      console.log(err.message);
      next({
        statusCode: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: 'На сервере произошла ошибка.',
      });
    });
}

export function createCard(req, res, next) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next({
          statusCode: constants.HTTP_STATUS_BAD_REQUEST,
          message: `Переданы некорректные данные при создании карточки. ${err.message}`,
        });
      } else {
        console.log(err.message);
        next();
      }
    });
}

export function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card && card.owner !== req.user._id) {
        return res.status(constants.HTTP_STATUS_FORBIDDEN).send({
          message: 'Forbiden',
        });
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((deletedCard) => {
          if (deletedCard) return res.send({ data: deletedCard });
          const error = new Error();
          error.name = 'ResourceNotFound';
          throw error;
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next({
              statusCode: constants.HTTP_STATUS_BAD_REQUEST,
              message: 'Передан некорректный id',
            });
          } else if (err.name === 'ResourceNotFound') {
            next({
              statusCode: constants.HTTP_STATUS_NOT_FOUND,
              message: 'Карточка с указанным _id не найдена.',
            });
          } else {
            console.log(err);
            next();
          }
        });
    });
}

export function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).populate('likes')
    .then((card) => {
      if (card) return res.send(card);
      const error = new Error();
      error.name = 'ResourceNotFound';
      throw error;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next({
          statusCode: constants.HTTP_STATUS_BAD_REQUEST,
          message: 'Передан некорректный id',
        });
      } else if (err.name === 'ResourceNotFound') {
        next({
          statusCode: constants.HTTP_STATUS_NOT_FOUND,
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        console.log(err);
        next();
      }
    });
}

export function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).populate('likes')
    .then((card) => {
      if (card) return res.send(card);
      const error = new Error();
      error.name = 'ResourceNotFound';
      throw error;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next({
          statusCode: constants.HTTP_STATUS_BAD_REQUEST,
          message: 'Передан некорректный id',
        });
      } else if (err.name === 'ResourceNotFound') {
        next({
          statusCode: constants.HTTP_STATUS_NOT_FOUND,
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        console.log(err);
        next();
      }
    });
}
