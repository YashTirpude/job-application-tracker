import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid token" });
    return;
  }
};
