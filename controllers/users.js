import { constants } from 'http2';
import User from '../model/user.js';

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.log(err);
      res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка.' });
    });
};

export const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(constants.HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: ` Переданы некорректные данные при создании пользователя. ${err.message}`,
        });
      } else {
        console.log(err);
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
          .send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        console.log(err);
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

export const setNewAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (user) return res.send(user);
      const error = new Error();
      error.name = 'ResourceNotFound';
      throw error;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Передан некорректный id' });
      } else if (err.name === 'ValidationError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Ошибка валидации' });
      } else if (err.name === 'ResourceNotFound') {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        console.log(err);
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

export const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (user) return res.send(user);
      const error = new Error();
      error.name = 'ResourceNotFound';
      throw error;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Передан некорректный id' });
      } else if (err.name === 'ValidationError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Ошибка валидации' });
      } else if (err.name === 'ResourceNotFound') {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        console.log(err);
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
