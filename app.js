import express from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import routerCard from './routes/cards.js';
import routerUser from './routes/users.js';

const run = async () => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const app = express();
  const config = { PORT: 3000, HOST: 'localhost' };

  app.use(express.json());
  app.use((req, res, next) => {
    req.user = {
      _id: '6372633cfbdd1869c7d517f4',
    };
    next();
  });

  app.use('/users', routerUser);
  app.use('/cards', routerCard);
  app.all('*', (req, res) => {
    res
      .status(constants.HTTP_STATUS_NOT_FOUND)
      .send({
        message: 'Запрашиваемая страница не найдена',
      });
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
