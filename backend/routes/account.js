// backend/routes/account.js
import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { Account } from "../db.js";
import { default as mongoose } from "mongoose";

const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

router.post("/send-otp", authMiddleware, async (req, res) => {
  try {
    // FIND CURRENT USER
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // GENERATE 4 DIGIT OTP
    const otp = crypto.randomInt(1000, 9999).toString();

    // DELETE OLD OTP
    await OTP.deleteMany({
      userId: req.userId,
    });

    // SAVE NEW OTP
    await OTP.create({
      userId: req.userId,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // SEND EMAIL
    await sendOtpEmail(user.username, otp);

    return res.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Error sending OTP",
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const { amount, to, otp } = req.body;

    // VALIDATE INPUTS
    if (!amount || !to || !otp) {
      return res.status(400).json({
        message: "Amount, recipient and OTP are required",
      });
    }

    // VERIFY OTP
    const otpRecord = await OTP.findOne({
      userId: req.userId,
      otp,
    });

    // INVALID OTP
    if (!otpRecord) {
      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    // OTP EXPIRED
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(401).json({
        message: "OTP expired",
      });
    }

    // FIND SENDER ACCOUNT
    const account = await Account.findOne({
      userId: req.userId,
    });

    if (!account) {
      return res.status(404).json({
        message: "Sender account not found",
      });
    }

    // CHECK BALANCE
    if (account.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // FIND RECEIVER ACCOUNT
    const toAccount = await Account.findOne({
      userId: to,
    });

    if (!toAccount) {
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    // PREVENT SELF TRANSFER
    if (req.userId === to) {
      return res.status(400).json({
        message: "Cannot transfer to your own account",
      });
    }

    // DEBIT SENDER
    await Account.updateOne(
      {
        userId: req.userId,
      },
      {
        $inc: {
          balance: -amount,
        },
      },
    );

    // CREDIT RECEIVER
    await Account.updateOne(
      {
        userId: to,
      },
      {
        $inc: {
          balance: amount,
        },
      },
    );

    // DELETE OTP AFTER SUCCESSFUL TRANSFER
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    return res.json({
      message: "Transfer successful",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
