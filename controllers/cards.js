import { constants } from 'http2';
import { Card } from '../model/card.js';

export function getCards(req, res) {
  Card.find({}).populate('owner')
    .then(cards => {
      if (cards) return res.send({ data: cards });
      throw new Error('Карточки не найдены');
    })
    .catch((err) => {
      if (err.message === 'Карточки не найдены') {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: `${err.message}` })
      } else {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка. ${err.message}` })
      }
      res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Карточка не найдена' })
    });
}

export function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err._message === 'card validation failed') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании карточки. ${err.message}`,
        })
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: `На сервере произошла ошибка. ${err.message}`,
        })
      }
    });
}

export function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err._message === 'card validation failed') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: ` Карточка с указанным _id не найдена. ${err.message}`,
        })
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: `На сервере произошла ошибка. ${err.message}`,
        })
      }
    });
};

export function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err._message === 'card validation failed') {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: `Передан несуществующий _id карточки.${err.message}`,
        })
      } else {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные для постановки/снятии лайка.${err.message}`,
        })
      }
    });
};

export function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err._message === 'card validation failed') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные для постановки/снятии лайка. ${err.message}`,
        })
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: `На сервере произошла ошибка. ${err.message}`,
        })
      }
      res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Передан несуществующий _id карточки.' })
    });
};
