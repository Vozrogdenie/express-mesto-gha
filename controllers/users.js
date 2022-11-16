import {User}  from '../model/user.js';
import { constants } from 'http2';

export const getUsers = (req, res) => {
  User.find({})
    .then(users => {
      if (users) return res.send({data: users});
      throw new Error('Нет пользователей');
    })
    .catch((err) => {
      console.log(err);
      if (err.message === 'Нет пользователей') {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: ` Переданы некорректные данные при создании пользователя${err.message}` })
      } else {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка. ${err.message}` })
      }
      res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Пользователь не найден' })
    });
};


export const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (err._message === 'user validation failed') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: ` Переданы некорректные данные при создании пользователя. ${err.message}`,
        })
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: `На сервере произошла ошибка. ${err.message}`,
        })
      }
  });
};

export const userId = (req, res) => {
  User.findOne({_id: req.params.userId})
  .then(user => {res.send(user)})
  .catch((err) => {
    if (err.name === 'ValidatorError' || err.name === 'CastError') {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        message: `Некорректные данные для пользователя. ${err.message}`,
      })
    } else {
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `На сервере произошла ошибка. ${err.message}`,
      })
    }
  });
}

export function newAvatar (req, res) {
  User.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { avatar: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
)};

export function newProfile (req, res) {
  User.findByIdAndUpdate(
    req.params.cardId,
    { new: true },
)};