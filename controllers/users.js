import { constants } from 'http2';
import bcrpt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import User from '../model/user.js';

export const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.log(err);
      next({
        statusCode: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: 'На сервере произошла ошибка.',
      });
    });
};

export const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrpt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      }).then((user) => res.status(constants.HTTP_STATUS_CREATED).send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next({
              statusCode: constants.HTTP_STATUS_BAD_REQUEST,
              message: `Переданы некорректные данные при создании пользователя. ${err.message}`,
            });
          } else if (err.code === 11000) {
            next({
              statusCode: constants.HTTP_STATUS_CONFLICT,
              message: 'Email уже существует',
            });
          } else {
            console.log(err);
            next();
          }
        });
    });
};

export const getUserById = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user) return res.send(user);
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
          message: 'Пользователь с указанным _id не найден.',
        });
      } else {
        console.log(err);
        next();
      }
    });
};

export const setNewAvatar = (req, res, next) => {
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
        next({
          statusCode: constants.HTTP_STATUS_BAD_REQUEST,
          message: 'Передан некорректный id',
        });
      } else if (err.name === 'ValidationError') {
        next({
          statusCode: constants.HTTP_STATUS_BAD_REQUEST,
          message: 'Ошибка валидации',
        });
      } else if (err.name === 'ResourceNotFound') {
        next({
          statusCode: constants.HTTP_STATUS_NOT_FOUND,
          message: 'Пользователь с указанным _id не найден.',
        });
      } else {
        console.log(err);
        next();
      }
    });
};

export const updateProfile = (req, res, next) => {
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
        next({
          statusCode: constants.HTTP_STATUS_BAD_REQUEST,
          message: 'Передан некорректный id',
        });
      } else if (err.name === 'ValidationError') {
        next({
          statusCode: constants.HTTP_STATUS_BAD_REQUEST,
          message: 'Ошибка валидации',
        });
      } else if (err.name === 'ResourceNotFound') {
        next({
          statusCode: constants.HTTP_STATUS_NOT_FOUND,
          message: 'Пользователь с указанным _id не найден.',
        });
      } else {
        console.log(err);
        next();
      }
    });
};

const jwt = jsonwebtoken;

export const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (user && bcrpt.compare(password, user.password)) {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        return res.send({ token });
      }
      const error = new Error();
      error.name = 'Unauthorized';
      error.message = 'Неправильный логин или пароль';
      throw error;
    })
    .catch((err) => {
      next({
        statusCode: constants.HTTP_STATUS_UNAUTHORIZED,
        message: err.message,
      });
    });
};
