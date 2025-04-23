import { type VercelRequest, type VercelResponse } from "@vercel/node";
import { app } from "../index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await app(req, res);
  } catch (error: any) {
    console.error("Serverless handler error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
