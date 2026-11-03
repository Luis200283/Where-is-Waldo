import { Router } from "express";
import { status, prismaTest } from "../controllers/indexController.ts";

export const indexRouter = Router();

indexRouter.get("/status", status);
indexRouter.get("/prisma/test", prismaTest);
