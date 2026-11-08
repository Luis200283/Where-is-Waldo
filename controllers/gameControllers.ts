import type { Request, Response } from "express";
import levels from "./charactes.json";
import { prisma } from "../db/prisma";

type chars = {
  x: number[];
  y: number[];
}[];

function findCharacters(chars: chars, x: number, y: number) {
  for (let i = 0; i < chars.length; i++) {
    const curr = chars[i];
    if (x > curr.x[0] && x < curr.x[1] && y > curr.y[0] && y < curr.y[1]) {
      return `char${i + 1}`;
    }
  }
  return `failed`;
}

export function playLevel(req: Request, res: Response) {
  const { lev, x, y } = req.query;
  const level = levels[Number(lev) - 1];
  const result = findCharacters(level, Number(x), Number(y));
  return res.json({ result });
}

export async function getPlayerScore(req: Request, res: Response) {
  const data = await prisma.score.findMany({
    select: { name: true, timeMs: true },
  });
  return res.status(200).json({users: data});
}

export async function newPlayerScore(req: Request, res: Response) {
  try {
    const { name, time } = req.body;
    await prisma.score.create({
      data: {
        name: String(name),
        timeMs: String(time),
      },
    });
    return res.status(201).json({ success: true, name, time });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        succes: false,
        message: "Hubo un error inesperado en el servidor",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        succes: false,
        message: "Hubo un error inesperado en el servidor",
        error: "error desconocido",
      });
    }
  }
}
