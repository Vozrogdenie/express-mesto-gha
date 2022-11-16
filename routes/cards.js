import { Router } from "express";
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} from "../controllers/cards.js"

export const routerCard = Router();

routerCard.get('/cards', getCards);
routerCard.post('/cards', createCard);
routerCard.delete('/cards/:cardId', deleteCard);
routerCard.put('/cards/:cardId', likeCard);
routerCard.delete('/cards/:cardId', dislikeCard);