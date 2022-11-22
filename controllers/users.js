import { constants } from 'http2';
import User from '../model/user.js';

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length) return res.send({ data: users });
      throw new Error('Нет пользователей');
    })
    .catch((err) => {
      if (err.message === 'Нет пользователей') {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: ` Переданы некорректные данные при создании пользователя${err.message}` });
      } else {
        console.log(err.message);
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      }
      res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Пользователь не найден' });
    });
};

export const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(constants.HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err._message === 'user validation failed') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: ` Переданы некорректные данные при создании пользователя. ${err.message}`,
        });
      } else {
        console.log(err._message);
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка.',
        });
      }
    });
};

export const getUserById = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user) return res.send(user);
      throw new Error('Пользователь не существует');
    })
    .catch((err) => {
      if (err.message === 'Пользователь не существует') {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          message: `Некорректные данные для пользователя. ${err.message}`,
        });
      } else {
        console.log(err.message);
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка.',
        });
      }
    });
};

export const newAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (user) return res.send(user);
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
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
    });
};

export const newProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (user) return res.send(user);
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
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
    });
};
