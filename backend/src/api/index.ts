// src/api/index.ts
import { type VercelRequest, type VercelResponse } from "@vercel/node";
import app from "../index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await app(req, res);
}
