import { constants } from 'http2';
import bcrpt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import {
  BadRequestError, ConflictError, NotFoundError, UnauthorizedError,
} from '../errors/Error.js';

export const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.log(err);
      next(err);
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
      }).then((user) => res.status(constants.HTTP_STATUS_CREATED).send({
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
          } else if (err.code === 11000) {
            next(new ConflictError('Email уже существует'));
          } else {
            console.log(err);
            next(err);
          }
        });
    });
};

export const getMe = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (user) return res.send(user);
      return next(new NotFoundError('Пользователь с указанным _id не найден.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else {
        console.log(err);
        next(err);
      }
    });
};

export const getUserById = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user) return res.send(user);
      return next(new NotFoundError('Пользователь с указанным _id не найден.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else {
        console.log(err);
        next(err);
      }
    });
};

export const setNewAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (user) return res.send(user);
      return next(new NotFoundError('Пользователь с указанным _id не найден.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        console.log(err);
        next(err);
      }
    });
};

export const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (user) return res.send(user);
      return next(new NotFoundError('Пользователь с указанным _id не найден.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        console.log(err);
        next(err);
      }
    });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user && bcrpt.compare(password, user.password)) {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        return res.send({ token });
      }
      return next(new UnauthorizedError('Неправильный логин или пароль'));
    })
    .catch((err) => {
      next(err);
    });
};
