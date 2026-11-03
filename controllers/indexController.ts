import type { Request, Response } from "express";
import { prisma } from "../db/prisma.ts";

export const status = (req: Request, res: Response) => {
  res.json({ status: "runing" });
};

export const prismaTest = async (req: Request, res: Response) => {
  const score = await prisma.score.findFirst({
    where: {name: "Luis"}
  });
  res.json(score);
};
