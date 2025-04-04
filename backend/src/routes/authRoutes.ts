import { Request, Response, Router } from "express";

import passport from "../config/passportConfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const googleUser = req.user as any;

      let user = await User.findOne({ email: googleUser.email });

      if (!user) {
        user = new User({
          googleId: googleUser.id,
          displayName: googleUser.displayName,
          email: googleUser.email,
          photo: googleUser.photos[0].value,
        });
        await user.save();
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Google login successful",
        user: {
          _id: user._id,
          displayName: user.displayName,
          email: user.email,
          photo: user.photo,
        },
        token,
      });
    } catch (error) {
      console.error("Google authentication error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/user", (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
});

// Manual Auth
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { displayName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      displayName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        displayName: newUser.displayName,
        email: newUser.email,
      },
      token,
    });
  } catch (error: any) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
    return;
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 🔹 Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d", // Token valid for 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
    return;
  }
});

export default router;
