// backend/routes/user.js

import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";

import { User, Account } from "../db.js";
import { JWT_SECRET } from "../config.js";
import { authMiddleware } from "../middleware.js";

const router = Router();

const { sign } = jwt;

/* =========================
   SIGNUP VALIDATION
========================= */

const signupBody = z.object({
  username: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(6),
});

/* =========================
   SIGNUP
========================= */

router.post("/signup", async (req, res) => {
  try {
    const { success } = signupBody.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        message: "Invalid inputs",
      });
    }

    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already taken",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // CREATE USER
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    const userId = user._id;

    // CREATE ACCOUNT
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    // GENERATE TOKEN
    const token = sign(
      {
        userId,
      },
      JWT_SECRET,
    );

    return res.status(201).json({
      message: "User created successfully",
      token,
      firstName: user.firstName,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

/* =========================
   SIGNIN VALIDATION
========================= */

const signinBody = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

/* =========================
   SIGNIN
========================= */

router.post("/signin", async (req, res) => {
  try {
    const { success } = signinBody.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        message: "Invalid inputs",
      });
    }

    // FIND USER
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // COMPARE PASSWORDS
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // GENERATE TOKEN
    const token = sign(
      {
        userId: user._id,
      },
      JWT_SECRET,
    );

    return res.json({
      token,
      firstName: user.firstName,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

/* =========================
   PASSWORD UPDATE VALIDATION
========================= */

const passwordUpdateBody = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

//   UPDATE PASSWORD

router.put("/", authMiddleware, async (req, res) => {
  console.log("NEW BACKEND CODE RUNNING");
  try {
    const { success } = passwordUpdateBody.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        message: "Invalid inputs",
      });
    }

    const { currentPassword, newPassword } = req.body;

    // PREVENT SAME PASSWORD
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    // FIND USER
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // VERIFY CURRENT PASSWORD
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // UPDATE PASSWORD
    await User.updateOne(
      { _id: req.userId },
      {
        password: hashedPassword,
      },
    );

    return res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

//   SEARCH USERS

router.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: filter,
            $options: "i",
          },
        },
      ],
    });

    return res.json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
