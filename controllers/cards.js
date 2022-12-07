import { BadRequestError, ForbiddenError, NotFoundError } from '../errors/Error.js';
import Card from '../model/card.js';

export function getCards(req, res, next) {
  Card.find({}).populate(['likes', 'owner'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      console.log(err.message);
      next(err);
    });
}

export function createCard(req, res, next) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        console.log(err.message);
        next(err);
      }
    });
}

export function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Forbiden'));
      }
      return card.remove()
        .then((deletedCard) => res.send({ data: deletedCard }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Передан некорректный id'));
          } else {
            console.log(err);
            next(err);
          }
        });
    });
}

export function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).populate(['likes', 'owner'])
    .then((card) => {
      if (card) return res.send(card);
      return next(new NotFoundError('Карточка с указанным _id не найдена.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else {
        console.log(err);
        next(err);
      }
    });
}

export function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).populate(['likes', 'owner'])
    .then((card) => {
      if (card) return res.send(card);
      return next(new NotFoundError('Карточка с указанным _id не найдена.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else {
        console.log(err);
        next(err);
      }
    });
}
