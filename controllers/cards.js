import { constants } from 'http2';
import Card from '../model/card.js';

export function getCards(req, res) {
  Card.find({}).populate(['likes', 'owner'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      console.log(err.message);
      res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка.' });
    });
}

export function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
      const error = new Error();
      error.name = 'ResourceNotFound';
      throw error;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Передан некорректный id' });
      } else if (err.name === 'ResourceNotFound') {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        console.log(err);
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
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
      const error = new Error();
      error.name = 'ResourceNotFound';
      throw error;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Передан некорректный id' });
      } else if (err.name === 'ResourceNotFound') {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        console.log(err);
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
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
      if (card) return res.send(card);
      const error = new Error();
      error.name = 'ResourceNotFound';
      throw error;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Передан некорректный id' });
      } else if (err.name === 'ResourceNotFound') {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        console.log(err);
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
}
