import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }

    // Hash the incoming token to match what's stored in the DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error: any) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
