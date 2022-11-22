import { constants } from 'http2';
import Card from '../model/card.js';

export function getCards(req, res) {
  Card.find({}).populate('likes').populate('owner')
    .then((cards) => {
      if (cards.length) return res.send({ data: cards });
      throw new Error('Карточки не найдены');
    })
    .catch((err) => {
      if (err.message === 'Карточки не найдены') {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: `${err.message}` });
      } else {
        console.log(err.message);
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      }
      res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    });
}

export function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err._message === 'card validation failed') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании карточки. ${err.message}`,
        });
      } else {
        console.log(err.message);
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка.',
        });
      }
    });
}

export function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new Error();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      } else {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
    });
}

export function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).populate('likes')
    .then((card) => {
      if (card) return res.send(card);
      throw new Error();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      } else {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
    });
}

export function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).populate('likes')
    .then((card) => {
      console.log(1, card);
      if (card) return res.send(card);
      throw new Error();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      } else {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
    });
}
