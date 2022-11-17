import { User } from '../model/user.js';
import { constants } from 'http2';

export const getUsers = (req, res) => {
  User.find({})
    .then(users => {
      if (users) return res.send({ data: users });
      throw new Error('Нет пользователей');
    })
    .catch((err) => {
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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
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
  if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
    User.findOne({ _id: req.params.userId })
    .then(user => {
      if (user) return res.send(user)
      throw new Error('Пользователь не существует')
    })
    .catch((err) => {
      if (err.message === 'Пользователь не существует') {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          message: `Некорректные данные для пользователя. ${err.message}`,
        })
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: `На сервере произошла ошибка. ${err.message}`,
        })
      }
    });
  } else {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
      message: `Некорректный userId`,
    })
  }
}

export const newAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate (req.user._id, {avatar}, { new: true }) // добавить _id в массив, если его там нет
    .then(user => {
      if (user) return res.send(user)
      throw new Error('Аватара не существует')
    })
    .catch((err) => {
      if (err.message === 'Аватара не существует') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при обновлении аватара. ${err.message}`,
        })
      } else {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' })
      }
    })
  // res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
  //   message: `На сервере произошла ошибка. ${err.message}`
  // })
};

export const newProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then(user => {
      if (user) return res.send(user)
      throw new Error('Профиля не существует')
    })
    .catch((err) => {
      if (err.message === 'Профиля не существует') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при обновлении профиля. ${err.message}`,
        })
      } else {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' })
      }
    })

};