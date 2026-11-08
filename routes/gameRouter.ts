import { Router } from "express";
import {
  playLevel,
  getPlayerScore,
  newPlayerScore,
} from "../controllers/gameControllers.ts";

export const gameRouter = Router();

gameRouter.get("/", playLevel);
gameRouter.get("/score", getPlayerScore);
gameRouter.post("/score", newPlayerScore);
