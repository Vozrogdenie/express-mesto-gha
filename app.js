import bodyParser from 'body-parser';
import express from 'express';
import mongoose from "mongoose";
import { routerCard } from './routes/cards.js';
import { router } from "./routes/users.js";
import { constants } from 'http2';

export const run = async (envName) => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const app = express();
  const config = { PORT: 3000, HOST: 'localhost' };

  app.use(bodyParser.json());
  app.use((req, res, next) => {
    req.user = {
      _id: "6372633cfbdd1869c7d517f4",
    };
    next();
  });

  app.use('/', router);
  app.use('/', routerCard);
  app.use(( err, req, res, next ) => {
    res.locals.error = err;
    if (err.status >= 100 && err.status < 600)
      res.status(err.status);
    else
      res.status(500);
    res.render('error');
  });
  app.get('*', (req, res) => {
    res
      .status(constants.HTTP_STATUS_NOT_FOUND)
      .send({
        "message": "Запрашиваемая страница не найдена"
      })
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


