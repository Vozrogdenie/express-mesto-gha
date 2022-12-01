import express from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import routerCard from './routes/cards.js';
import routerUser from './routes/users.js';
import auth from './middlewares/auth.js';
import { createUser, login } from './controllers/users.js';
import validateCreateUser from './validation/users.js';

console.log(process.env.NODE_ENV);

const run = async () => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const app = express();
  const config = {
    PORT: 3000,
    HOST: 'localhost',
  };

  app.use(cookieParser());

  app.use(express.json());
  app.post('/signup', validateCreateUser, createUser);
  app.post('/signin', login);
  app.use(auth);
  app.use('/users', routerUser);
  app.use('/cards', routerCard);

  app.use(errors());
  app.all('*', (req, res) => {
    res
      .status(constants.HTTP_STATUS_NOT_FOUND)
      .send({
        message: 'Запрашиваемая страница не найдена',
      });
  });
  app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
    next();
  });
  mongoose.set('runValidators', true);
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  const server = app.listen(config.PORT, config.HOST, () => {
    console.log(`Server run on http://${config.HOST}:${config.PORT}`);
  });

  const stop = async () => {
    await mongoose.connection.close();
    server.close();
    process.exit(0);
  };

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
};

run();
